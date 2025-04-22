"use client";

import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useLocationSharing } from "@/hooks/useLocationSharing";

export default function SendLocation() {
  const [phone, setPhone] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const { getLocationLink } = useLocationSharing();

  const sendLocation = async () => {
    const link = await getLocationLink();
    if (link) {
      const res = await fetch("/api/send-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, link }),
      });

      if (res.ok) setMessageSent(true);
      else alert("Failed to send SMS");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter phone number:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="+1234567890"
      />
      <Button title="Share My Location" onPress={sendLocation} />
      {messageSent && <Text style={{ color: "green", marginTop: 10 }}>Location shared!</Text>}
    </View>
  );
}
