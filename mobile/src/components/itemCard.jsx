import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#EEF2FF",
  text: "#0F172A",
  secondaryText: "#64748B",
  muted: "#94A3B8",
  white: "#FFFFFF",
  border: "#E2E8F0",
  found: "#059669",
  foundLight: "#ECFDF5",
  lost: "#DC2626",
  lostLight: "#FEF2F2",
  placeholder: "#F8FAFC",
};

const ItemCard = ({ item, onPress }) => {
  const isFound = item.type === "found";

  const accentColor = isFound
    ? COLORS.found
    : COLORS.lost;
  const accentLight = isFound
    ? COLORS.foundLight
    : COLORS.lostLight;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={styles.card}
    >
      {/* ==========
          Image
      ========== */}
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <View
              style={[
                styles.placeholderIcon,
                {
                  backgroundColor: accentLight,
                },
              ]}
            >
              <Ionicons
                name={
                  isFound
                    ? "checkmark-circle-outline"
                    : "search-outline"
                }
                size={40}
                color={accentColor}
              />
            </View>
          </View>
        )}
        {/* Image overlay */}
        {item.images && item.images.length > 1 && (
          <View style={styles.imageCount}>
            <Ionicons
              name="images-outline"
              size={11}
              color={COLORS.white}
            />
            <Text style={styles.imageCountText}>
              {item.images.length}
            </Text>
          </View>
        )}
      </View>
      {/* ==========
          Content
      ========== */}
      <View style={styles.body}>
        {/* Top Row */}
        <View style={styles.topRow}>
          {/* Tag Code */}
          <View style={styles.tagContainer}>
            <Text style={styles.tagCode}>
              #{item.tagCode}
            </Text>
          </View>
          {/* Status */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: accentLight,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: accentColor,
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: accentColor,
                },
              ]}
            >
              {isFound ? "FOUND" : "LOST"}
            </Text>
          </View>
        </View>
        {/* Title */}
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={COLORS.secondaryText}
          />
          <Text
            style={styles.location}
            numberOfLines={1}
          >
            {item.location?.address ||
              "Unknown location"}
          </Text>
        </View>
        {/* Bottom Accent */}
        <View style={styles.bottomRow}>
          <View
            style={[
              styles.typeIndicator,
              {
                backgroundColor: accentColor,
              },
            ]}
          />
          <Text style={styles.viewDetails}>
            View details
          </Text>
          <Ionicons
            name="chevron-forward"
            size={15}
            color={"#000000"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
 
  // Card
  card: {
  flexDirection: "row",
  backgroundColor: "#f0eff6",
  borderRadius: 18,

  borderTopWidth: 3,
  borderTopColor: "#2a189c",

  marginBottom: 14,
  overflow: "hidden",

  shadowColor: "#0F172A",
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.07,
  shadowRadius: 12,
  elevation: 3,
},
 
  // Image
 
  imageContainer: {
    width: 106,
    height: 126,
    backgroundColor: COLORS.placeholder,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  placeholderIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
 
  // Image Count
 
  imageCount: {
    position: "absolute",
    right: 7,
    bottom: 7,
    minWidth: 30,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 8,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imageCountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 4,
  },
 
  // Body
 
  body: {
    flex: 1,
    paddingHorizontal: 13,
    paddingVertical: 12,
    justifyContent: "space-between",
    minWidth: 0,
  },
 
  // Top Row
 
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
 
  // Tag
 
  tagContainer: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
  tagCode: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
 
  // Status
 
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
 
  // Title
 
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.2,
    marginBottom: 5,
  },
 
  // Location
 
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  location: {
    flex: 1,
    fontSize: 12,
    color: COLORS.secondaryText,
    marginLeft: 5,
  },
 
  // Bottom Row
 
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },
  typeIndicator: {
    width: 5,
    height: 5,
    borderRadius: 999,
    marginRight: 6,
  },
  viewDetails: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
  },
});
export default ItemCard;
