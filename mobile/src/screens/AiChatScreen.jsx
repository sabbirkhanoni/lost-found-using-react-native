import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import OSMMapView from '../components/OSMMapView';
import { chatWithAiApi } from '../api/ai.api';
import { createItemApi } from '../api/item.api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

const GREETING = 'Hi! Did you find something, or did you lose something?';

const AiChatScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([
    { id: '0', sender: 'ai', text: GREETING, raw: null },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState(null); // সর্বশেষ AI response এর extracted fields
  const [coords, setCoords] = useState(null);
  const [posting, setPosting] = useState(false);
  const listRef = useRef(null);

  const buildHistory = () =>
    messages.map(m => ({
      role: m.sender,
      text: m.sender === 'ai' && m.raw ? JSON.stringify(m.raw) : m.text,
    }));

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
    };
    const history = buildHistory();
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const response = await chatWithAiApi(userMessage.text, history);
      const data = response.data.data;

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '-ai',
          sender: 'ai',
          text: data.reply,
          raw: data,
        },
      ]);
      setDraft(data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'AI chat failed');
    } finally {
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleUseCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position =>
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      error => Alert.alert('Error', error.message || 'Failed to get location'),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const handleMapPick = ({ latitude, longitude }) =>
    setCoords({ latitude, longitude });

  const handleConfirmPost = async () => {
    if (!coords) {
      Alert.alert('Error', 'Please pin the exact location on the map first');
      return;
    }
    try {
      setPosting(true);
      const response = await createItemApi({
        type: draft.type,
        title: draft.title,
        description: draft.description,
        images: [],
        longitude: coords.longitude,
        latitude: coords.latitude,
        address: draft.address,
      });
      Alert.alert('Success', response.data.message);
      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to post item',
      );
    } finally {
      setPosting(false);
    }
  };

  const readyToConfirm = draft?.readyToPost;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text>←</Text>
        </TouchableOpacity>
        <View style={styles.headerIcon}>
          <Ionicons name="chatbubbles" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Lost & Found AI</Text>
          <Text style={styles.headerSubtitle}>Always ready to help</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.sender === 'ai' ? styles.bubbleAi : styles.bubbleMe,
            ]}
          >
            {item.sender === 'ai' && (
              <Text style={styles.aiTag}>
                <Ionicons name="sparkles" size={12} color="#6C5CE7" /> Lost & Found AI</Text>
            )}
            <Text
              style={
                item.sender === 'ai' ? styles.bubbleTextAi : styles.bubbleTextMe
              }
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {readyToConfirm && (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmLabel}>📍 Pin the exact location</Text>
          <View style={styles.mapWrap}>
            <OSMMapView
              key={
                coords ? `${coords.latitude}-${coords.longitude}` : 'default'
              }
              latitude={coords?.latitude || 23.7808}
              longitude={coords?.longitude || 90.2792}
              zoom={coords ? 16 : 12}
              markers={
                coords
                  ? [
                      {
                        id: 'picked',
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        color: '#6C5CE7',
                      },
                    ]
                  : []
              }
              pickable
              onMapPress={handleMapPick}
            />
          </View>
          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            style={styles.locBtn}
          >
            <Text style={styles.locBtnText}>
              {coords ? 'Location Set ✓' : 'Use Current Location'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirmPost}
            disabled={posting}
            style={[
              styles.postBtn,
              {
                backgroundColor: draft.type === 'found' ? '#17B890' : '#FF6B5B',
              },
            ]}
          >
            <Text style={styles.postBtnText}>
              {posting ? 'Posting...' : 'Confirm & Post'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View
        style={[
          styles.inputRow,
          {
            paddingBottom: 12 + insets.bottom,
          },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#C2BFDA"
          value={input}
          onChangeText={setInput}
          editable={!sending}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ color: '#fff' }}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF',paddingTop: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: '#6C5CE7',
    paddingTop: 20,
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontWeight: '800', fontSize: 14 },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
  bubbleAi: {
    backgroundColor: '#ECE7FF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleMe: {
    backgroundColor: '#6C5CE7',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiTag: { fontSize: 9, fontWeight: '800', color: '#5641D8', marginBottom: 4 },
  bubbleTextAi: { color: '#1B1B3A', fontSize: 13 },
  bubbleTextMe: { color: '#fff', fontSize: 13 },
  confirmBox: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E7E4F6',
    padding: 14,
  },
  confirmLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#68678A',
    marginBottom: 8,
  },
  mapWrap: {
    height: 130,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
  },
  locBtn: {
    borderWidth: 1,
    borderColor: '#6C5CE7',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  locBtnText: { color: '#6C5CE7', fontWeight: '700', fontSize: 12.5 },
  postBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E7E4F6',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: '#1B1B3A',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AiChatScreen;
