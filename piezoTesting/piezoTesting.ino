#include <avr/wdt.h>
int input = 0;

int lightStart = 2;
int lightEnd = 8;

bool emaSeeded = false;
float emAverage = 0;
int sAverage[100];
int lowerDeadZone = 100;
int lowerMargin = 30;

float averageSmoothing = 0;

int tickCount = 0;
int tickCarryMoving = 1000;
int tickCarrySimpleMod = 4;

void AddToStartOfArray(int value, int array[], int length, bool doPrint = false);

void setup() {
  Serial.begin(9600);
  //wdt_enable(WDTO_2S);
  Serial.println("Device was reset");
  for (int i = lightStart; i <= lightEnd; i++) {
    pinMode(i, OUTPUT);
  }
  for (int i = 0; i < sizeof(sAverage) / sizeof(sAverage[0]); i++){
    sAverage[i] = lowerMargin;
  }

  averageSmoothing = (float)2 / ((sizeof(sAverage) / sizeof(sAverage[0])) + 1);
  Serial.println("smoothingMult = " + String(averageSmoothing));
}

void loop() {
  tickCount++;

  int rawData = analogRead(input);
  //Serial.println("raw data: " + String(rawData));
  int safeValue = constrain(rawData, 0, 1023);
  //Serial.println("safe data: " + String(safeValue));
  float normalizedValue = map(safeValue, 0, 1023, 0, 100);
  //Serial.println("normalized data: " + String(normalizedValue));

  float currentLightStage = map(normalizedValue, 0, 100, lightStart, lightEnd);
  for (int i = lightStart; i <= lightEnd; i++) {
    if (i < currentLightStage) {
      digitalWrite(i, HIGH);
    } else {
      digitalWrite(i, LOW);
    }
  }

  if (tickCount % tickCarryMoving / tickCarrySimpleMod) {
    if (normalizedValue > lowerMargin){
      AddToStartOfArray(normalizedValue, sAverage, sizeof(sAverage) / sizeof(sAverage[0]));
      Serial.println(sAverage[0]);
    }
      FindExponentialAverage(sAverage[0]);
  }

  if (tickCount >= tickCarryMoving) {  // inner loop #1
    tickCount = 0;
  }
}

void AddToStartOfArray(int value, int array[], int length, bool doPrint) {
  for (int i = 0; i < length - 1; i++) {
    array[i + 1] = array[i];
  }

  array[0] = value;

  if (doPrint) {
    for (int i = 0; i < length; i++) {
      Serial.println(array[i]);
    }
  }
}

float FindSimpleAverage(int array[], int length) {
  long sum = 0;
  for (int i = 0; i < length; i++) {
    sum += array[i];
  }
  return (float)sum / length;
}

float FindExponentialAverage(int value) {
  if (!emaSeeded) {
    emAverage = FindSimpleAverage(sAverage, sizeof(sAverage) / sizeof(sAverage[0]));
    emaSeeded = true;
  }
  emAverage = (value * averageSmoothing) + (emAverage * (1.0 - averageSmoothing));
  return emAverage;
}
