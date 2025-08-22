import * as React from "react";
import { StyleSheet, Image, Text, View } from "react-native";

const TestFrame = () => {
  return (
    <View style={styles.viewBg}>
      <View style={[styles.view, styles.viewBg]}>
        <Rectangle1 style={styles.childLayout} width={345} height={228} />
        <Image
          style={[styles.image1Icon, styles.childLayout]}
          resizeMode="cover"
          source="image 1.png"
        />
        <Text style={styles.getStartedWith}>{`Get Started with
          					AgriAngat`}</Text>
        <Text style={styles.empoweringFarmersIntelligen}>
          Empowering Farmers. Intelligently.
        </Text>
        <Text style={[styles.fromUnbankedTo, styles.fromUnbankedToTypo]}>
          From Unbanked to Unstoppable.
        </Text>
        <Text style={[styles.oneEcosystemInfinite, styles.fromUnbankedToTypo]}>
          One Ecosystem. Infinite Growth.
        </Text>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Log In / Sign In</Text>
        </View>
        <Text style={styles.agriangatCombinesClimate}>
          AgriAngat combines climate data, AI, and real-time insights to give
          Filipino farmers what they’ve long deserved — access, dignity, and
          opportunity. It's more than an app — it’s a movement rooted in
          inclusion.
        </Text>
        <Text
          style={[styles.withEsgBasedInsights, styles.withEsgBasedInsightsTypo]}
        >
          With ESG-based insights, AgriAngat helps farmers become creditworthy —
          no paperwork, no collateral. Just data, transparency, and a clear path
          to growth.
        </Text>
        <Text
          style={[
            styles.agriangatLinksFarmers,
            styles.withEsgBasedInsightsTypo,
          ]}
        >
          AgriAngat links farmers, retailers, and lenders into a single
          climate-smart network — making each connection count toward a more
          sustainable and inclusive future.
        </Text>
        <Image
          style={styles.appLogoIcon}
          resizeMode="cover"
          source="App Logo.png"
        />
        <View style={[styles.bottomBar, styles.bottomBarLayout]}>
          <View style={styles.bottomBarInner}>
            <View style={[styles.homeIndicatorWrapper, styles.homePosition]}>
              <View style={[styles.homeIndicator, styles.homePosition]} />
            </View>
          </View>
          <View style={[styles.homeindicator, styles.homePosition]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  testFrame: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewBg: {
    backgroundColor: "#fff",
    flex: 1,
  },
  childLayout: {
    height: 228,
    width: 345,
    borderRadius: 16,
    left: 24,
    top: 125,
    position: "absolute",
  },
  fromUnbankedToTypo: {
    width: 297,
    left: 34,
    color: "#000",
    textAlign: "left",
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: -0.2,
    fontSize: 18,
    position: "absolute",
  },
  withEsgBasedInsightsTypo: {
    width: 318,
    left: 36,
    fontFamily: "Poppins-Light",
    fontWeight: "300",
    letterSpacing: 0.4,
    fontSize: 12,
    color: "#000",
    textAlign: "left",
    position: "absolute",
  },
  bottomBarLayout: {
    height: 34,
    left: 0,
  },
  homePosition: {
    bottom: 0,
    position: "absolute",
  },
  image1Icon: {
    opacity: 0.86,
  },
  getStartedWith: {
    top: 289,
    left: 52,
    textAlign: "left",
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: -0.2,
    fontSize: 18,
    position: "absolute",
  },
  empoweringFarmersIntelligen: {
    top: 395,
    width: 236,
    color: "#000",
    left: 35,
    textAlign: "left",
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: -0.2,
    fontSize: 18,
    position: "absolute",
  },
  fromUnbankedTo: {
    top: 555,
  },
  oneEcosystemInfinite: {
    top: 677,
  },
  buttonText: {
    letterSpacing: 0.4,
    fontSize: 12,
    textAlign: "left",
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
  },
  button: {
    marginTop: -135,
    marginLeft: 17.5,
    top: "50%",
    borderRadius: 55,
    backgroundColor: "rgba(0, 0, 0, 0)",
    width: 133,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    left: "50%",
    position: "absolute",
  },
  agriangatCombinesClimate: {
    top: 440,
    width: 312,
    fontFamily: "Poppins-Light",
    fontWeight: "300",
    letterSpacing: 0.4,
    fontSize: 12,
    color: "#000",
    left: 35,
    textAlign: "left",
    position: "absolute",
  },
  withEsgBasedInsights: {
    top: 580,
  },
  agriangatLinksFarmers: {
    top: 702,
  },
  appLogoIcon: {
    top: 59,
    width: 58,
    height: 58,
    left: 34,
    position: "absolute",
  },
  homeIndicator: {
    borderRadius: 100,
    backgroundColor: "#000",
    marginLeft: -67,
    bottom: 0,
    height: 5,
    width: 134,
    left: "50%",
  },
  homeIndicatorWrapper: {
    marginLeft: -67,
    bottom: 0,
    height: 5,
    width: 134,
    left: "50%",
  },
  bottomBarInner: {
    marginLeft: -66.5,
    bottom: 8,
    height: 5,
    width: 134,
    left: "50%",
    position: "absolute",
  },
  homeindicator: {
    right: 0,
    height: 34,
    left: 0,
  },
  bottomBar: {
    top: 818,
    width: 393,
    position: "absolute",
    height: 34,
    left: 0,
  },
  view: {
    width: "100%",
    height: 852,
    overflow: "hidden",
  },
});

export default TestFrame;
