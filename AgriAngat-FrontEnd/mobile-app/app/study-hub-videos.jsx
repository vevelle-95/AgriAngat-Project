import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

export default function StudyHubVideosScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  const categories = [
    { id: "all", name: "All", count: 24 },
    { id: "planting", name: "Planting", count: 8 },
    { id: "irrigation", name: "Irrigation", count: 6 },
    { id: "pest-control", name: "Pest Control", count: 5 },
    { id: "harvesting", name: "Harvesting", count: 3 },
    { id: "marketing", name: "Marketing", count: 2 }
  ];

  const videos = [
    {
      id: 1,
      title: "Modern Rice Planting Techniques",
      description: "Learn the latest methods for efficient rice planting and spacing",
      duration: "12:45",
      views: "2.1K",
      category: "planting",
      thumbnail: "🌾",
      instructor: "Dr. Maria Santos",
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Drip Irrigation System Setup",
      description: "Step-by-step guide to installing and maintaining drip irrigation",
      duration: "18:30",
      views: "1.8K",
      category: "irrigation",
      thumbnail: "💧",
      instructor: "Eng. Juan dela Cruz",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Organic Pest Control Methods",
      description: "Natural ways to protect your crops from common pests",
      duration: "15:20",
      views: "3.2K",
      category: "pest-control",
      thumbnail: "🐛",
      instructor: "Dr. Ana Rodriguez",
      difficulty: "Beginner"
    },
    {
      id: 4,
      title: "Optimal Harvest Timing for Vegetables",
      description: "Know when your vegetables are ready for harvest",
      duration: "10:15",
      views: "1.5K",
      category: "harvesting",
      thumbnail: "🥕",
      instructor: "Prof. Carlos Mendoza",
      difficulty: "Beginner"
    },
    {
      id: 5,
      title: "Digital Marketing for Farmers",
      description: "Use social media and online platforms to sell your produce",
      duration: "22:10",
      views: "987",
      category: "marketing",
      thumbnail: "📱",
      instructor: "Ms. Lisa Tan",
      difficulty: "Advanced"
    },
    {
      id: 6,
      title: "Corn Planting Best Practices",
      description: "Maximize your corn yield with proper planting techniques",
      duration: "14:35",
      views: "2.5K",
      category: "planting",
      thumbnail: "🌽",
      instructor: "Dr. Roberto Garcia",
      difficulty: "Intermediate"
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "#34C759";
      case "Intermediate": return "#FF9500";
      case "Advanced": return "#FF3B30";
      default: return "#666";
    }
  };

  const renderVideoCard = (video) => (
    <TouchableOpacity key={video.id} style={styles.videoCard}>
      <View style={styles.thumbnailContainer}>
        <Text style={styles.thumbnail}>{video.thumbnail}</Text>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </View>
      
      <View style={styles.videoContent}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoDescription}>{video.description}</Text>
        
        <View style={styles.videoMeta}>
          <Text style={styles.instructor}>👨‍🏫 {video.instructor}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.views}>👁 {video.views} views</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(video.difficulty) + "20" }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(video.difficulty) }]}>
                {video.difficulty}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Study Hub</Text>
      <Text style={styles.subtitle}>Learn from agricultural experts</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search videos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonSelected
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category.id && styles.categoryButtonTextSelected
            ]}>
              {category.name} ({category.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Section */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>🔥 Featured This Week</Text>
        <TouchableOpacity style={styles.featuredCard}>
          <View style={styles.featuredThumbnail}>
            <Text style={styles.featuredIcon}>🌾</Text>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶️</Text>
            </View>
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Smart Farming with IoT Sensors</Text>
            <Text style={styles.featuredDescription}>
              Discover how technology can revolutionize your farming practices
            </Text>
            <Text style={styles.featuredMeta}>25:40 • Dr. Tech Farmer • 5.2K views</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Videos List */}
      <ScrollView style={styles.videosContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.videosHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "all" ? "All Videos" : categories.find(c => c.id === selectedCategory)?.name + " Videos"}
          </Text>
          <Text style={styles.videoCount}>{filteredVideos.length} videos</Text>
        </View>
        
        {filteredVideos.length > 0 ? (
          filteredVideos.map(renderVideoCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📹</Text>
            <Text style={styles.emptyTitle}>No videos found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  backIcon: {
    fontSize: 20,
    marginRight: 8,
    color: "#333",
  },
  backText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-ExtraBold",
    color: "#111",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  categoryButtonSelected: {
    backgroundColor: "#0f6d00",
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  categoryButtonTextSelected: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 15,
  },
  featuredCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredThumbnail: {
    height: 180,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  featuredIcon: {
    fontSize: 48,
  },
  playButton: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 20,
  },
  featuredContent: {
    padding: 15,
  },
  featuredTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 6,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  featuredMeta: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#999",
  },
  videosContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  videosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  videoCount: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  videoCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  thumbnailContainer: {
    width: 120,
    height: 90,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  thumbnail: {
    fontSize: 24,
  },
  durationBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 10,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  videoContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  videoTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#111",
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    lineHeight: 16,
    marginBottom: 8,
  },
  videoMeta: {
    gap: 6,
  },
  instructor: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#333",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  views: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#999",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: "Poppins-Bold",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
  },
});
