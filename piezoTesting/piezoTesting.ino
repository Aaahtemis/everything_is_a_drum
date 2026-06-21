#include <avr/wdt.h>
int input = 0;

int lightStart = 2;
int lightEnd = 8;

bool emaSeeded = false;
float emAverage = 0;
int sAverage[100];
int lowerDeadZone = 100;
int lowerMargin = 20;

float averageSmoothing = 0;

int tickCount = 0;
int tickCarryMoving = 1000;
int tickCarrySimpleMod = 1;

bool isActive = false;

void AddToStartOfArray(int value, int array[], int length, bool doPrint = false);
float FindExponentialAverage(int value);

void setup() {
  Serial.begin(9600);
  //wdt_enable(WDTO_2S);
  Serial.println("Device was reset");
  for (int i = lightStart; i <= lightEnd; i++) {
    pinMode(i, OUTPUT);
  }
  for (int i = 0; i < sizeof(sAverage) / sizeof(sAverage[0]); i++) {
    sAverage[i] = lowerMargin;
  }

  averageSmoothing = (float)2 / ((sizeof(sAverage) / sizeof(sAverage[0])) + 1);
  Serial.println("smoothingMult = " + String(averageSmoothing));
}

void loop() {
  tickCount++;
  if (tickCount % tickCarryMoving / tickCarrySimpleMod) {
    
    uint8_t analogPin = A0;
    for (int i = 0; i < 6; i++) {
      switch (i) {
        case 0:
          analogPin = uint8_t(A0);
          break;
        case 1:
          analogPin = uint8_t(A1);
          break;
        case 2:
          analogPin = uint8_t(A2);
          break;
        case 3:
          analogPin = uint8_t(A3);
          break;
        case 4:
          analogPin = uint8_t(A4);
          break;
        case 5:
          analogPin = uint8_t(A5);
          break;
      }
      int rawData = analogRead(A0);

      //Serial.println("raw data: " + String(rawData));
      int safeValue = constrain(rawData, 0, 1023);
      //Serial.println("safe data: " + Striuint8_tng(safeValue));
      float normalizedValue = map(safeValue, 0, 1023, 0, 127);
      //Serial.println("normalized data: " + String(normalizedValue));

      if (normalizedValue > lowerMargin) {
        Serial.println(String(i) + " sensor value : " + String(normalizedValue));
        AddToStartOfArray(normalizedValue, sAverage, sizeof(sAverage) / sizeof(sAverage[0]));
        //FindExponentialAverage(sAverage[0]);
        digitalWrite(i + 2, HIGH);
      } else {
        digitalWrite(i + 2, LOW);
      }
    }
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

void doAction() {

  isActive = !isActive;
}
