uint8_t pad;
uint8_t velocity;

void setup() {
  Serial.begin(9600);
}

void loop() {
  // for testing just iterate over all pads and velocities
  pad = (pad + 1) % 12;
  velocity = (velocity + 1) % 128;
  delay(1000);

  // send a byte where the first nybble represents the pad
  // the second nybble represents velocity
  uint8_t pad_bits = pad << 4;
  uint8_t data = pad_bits | velocity;
  Serial.println(data);
}
