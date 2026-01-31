
import CustomButton from '@/components/Button';
import CustomImage from '@/components/Image';
import { Link } from 'expo-router';
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
const imageSource = require("@/assets/images/homepage.webp");
export default function Index() {

  return (
    <ScrollView>
      <View
        style={styles.container}
      >
        <CustomImage source={imageSource} />
        <Text
          style={{
            fontSize: 20,          // ~ text-4xl
            fontWeight: "700",     // font-bold
            color: "#111827",      // text-gray-900
            lineHeight: 22,        // leading-tight
          }}
        >Parents arriving today or tomorrow?
        </Text>
        <View>
          <Text style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#111827",
            lineHeight: 22,
          }}> We personally</Text>
          <Text style={{
            color: "#1D4ED8", fontSize: 20, fontWeight: "700",
            lineHeight: 22,
          }}>
            {" "}receive them at the station/airport and drop them home safely
          </Text>
          <Text style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#111827",
            lineHeight: 22,
          }}> — and also</Text>
          <Text style={{
            color: "#15803D", fontSize: 20, fontWeight: "700",
            lineHeight: 22,
          }}>
            {" "}receive them at home and drop them at the station/airport
          </Text>.
        </View>
        <Text
          style={{
            fontSize: 18,          // text-lg
            color: "#4B5563",      // text-gray-600
            lineHeight: 26,
            maxWidth: 520,
            marginTop: 10       // max-w-xl
          }}
        >
          A trained Care Companion receives your parent at the airport/railway
          station and ensures a safe drop home — or receives them from home and
          drops them at the airport/railway station — with live updates for you.
        </Text>
        <Button title="call us" onPress={() => { alert("button is clicked") }} />
        <CustomButton label='Welcome' onPress={() => { alert("Pressable button is clicked") }} />
        <Link href="/about"><Text>Go to About page</Text></Link>
      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6F8",
    margin: 20,
  },
  text: {
    color: "gray"
  }
})