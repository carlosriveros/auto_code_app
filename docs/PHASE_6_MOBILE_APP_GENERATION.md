# Phase 6: Mobile App Generation - Deep Dive

## Vision
**Generate production-ready iOS and Android apps using AI, build them in the cloud, and distribute them to testers—all from your phone.**

---

## Table of Contents
1. [Overview](#overview)
2. [Technical Architecture](#technical-architecture)
3. [React Native Code Generation](#react-native-code-generation)
4. [Expo Integration](#expo-integration)
5. [Cloud Build System](#cloud-build-system)
6. [Native Features](#native-features)
7. [Testing & Distribution](#testing--distribution)
8. [App Store Submission](#app-store-submission)
9. [Implementation Plan](#implementation-plan)
10. [Cost Analysis](#cost-analysis)

---

## Overview

### What This Enables
- **From phone, build phone apps** - Build iOS/Android apps using your phone
- **No Mac required** - Cloud builds mean no need for Xcode
- **AI generates everything** - Navigation, screens, native features
- **Instant distribution** - TestFlight/Play Store beta in minutes

### User Flow Example
```
You: "Build an iOS dating coach app with chat, profile, and content library"

AI generates:
1. React Native project with Expo
2. Navigation structure (tabs + stack)
3. Chat screen with AI integration
4. Profile screen with photo upload
5. Content library with video player
6. Push notification setup
7. App icon and splash screen
8. Build configuration

5 minutes later:
→ App built in cloud
→ QR code to install on iPhone
→ TestFlight link shared
```

---

## Technical Architecture

### Tech Stack

#### Framework & Tools
```yaml
Core:
  - React Native 0.76+ (New Architecture)
  - Expo SDK 52+
  - TypeScript
  - React Navigation 7

Build & Deploy:
  - EAS Build (Expo Application Services)
  - EAS Submit (App Store automation)
  - EAS Update (OTA updates)

Backend:
  - Existing Express backend
  - Expo Push Notification Service
  - AWS S3 for assets

Native Modules:
  - expo-camera
  - expo-location
  - expo-local-authentication
  - expo-notifications
  - expo-contacts
  - expo-calendar
  - expo-image-picker
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App Builder (Web)                  │
│                         Your Phone                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ 1. User Prompt: "Build dating coach app"
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      Claude AI (Sonnet)                      │
│  - Generates React Native code                               │
│  - Creates navigation structure                              │
│  - Sets up native features                                   │
│  - Configures app.json                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ 2. Generated Code + Config
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 Backend API (Express)                        │
│  - Stores project files                                      │
│  - Manages build configurations                              │
│  - Handles Expo credentials                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ 3. Trigger Build via EAS CLI
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    EAS Build (Cloud)                         │
│  ┌──────────────────┐        ┌──────────────────┐          │
│  │   iOS Builder    │        │  Android Builder │          │
│  │   (macOS VM)     │        │   (Linux VM)     │          │
│  │                  │        │                  │          │
│  │  - Compiles JS   │        │  - Compiles JS   │          │
│  │  - Builds native │        │  - Builds native │          │
│  │  - Signs app     │        │  - Signs APK/AAB │          │
│  │  - Creates IPA   │        │  - Creates bundle│          │
│  └──────────────────┘        └──────────────────┘          │
└─────────────────┬───────────────────┬───────────────────────┘
                  │                   │
                  │ 4. Build Artifacts
                  ▼                   ▼
┌───────────────────────┐   ┌─────────────────────────┐
│   TestFlight (iOS)    │   │  Google Play (Android)  │
│   - Beta testing      │   │  - Internal testing     │
│   - QR code install   │   │  - QR code install      │
└───────────────────────┘   └─────────────────────────┘
                  │                   │
                  │ 5. Install & Test
                  ▼                   ▼
            ┌──────────────────────────────┐
            │   User's iPhone/Android      │
            │   Testing the generated app  │
            └──────────────────────────────┘
```

---

## React Native Code Generation

### How AI Generates Mobile Apps

#### 1. Project Structure Generation

**AI Prompt Template:**
```
Generate a React Native Expo app with the following:
- App name: [user input]
- Description: [user input]
- Features: [user input]
- Navigation: [tabs/stack/drawer]
- Screens: [list of screens]
- Native features: [camera, location, etc]

Use TypeScript, React Navigation 7, and Expo SDK 52.
```

**Generated Structure:**
```
mobile-app/
├── app.json                    # Expo config
├── eas.json                    # Build config
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
│
├── App.tsx                     # Root component
│
├── src/
│   ├── navigation/
│   │   ├── index.tsx          # Root navigator
│   │   ├── TabNavigator.tsx   # Bottom tabs
│   │   └── StackNavigator.tsx # Stack navigation
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Avatar.tsx
│   │
│   ├── services/
│   │   ├── api.ts             # Backend API client
│   │   ├── auth.ts            # Authentication
│   │   └── notifications.ts   # Push notifications
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCamera.ts
│   │   └── useLocation.ts
│   │
│   ├── store/
│   │   └── index.ts           # Zustand store
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── utils/
│       ├── storage.ts         # AsyncStorage wrapper
│       └── constants.ts
│
└── assets/
    ├── icon.png               # App icon (1024x1024)
    ├── splash.png             # Splash screen
    ├── adaptive-icon.png      # Android adaptive icon
    └── fonts/
```

#### 2. Navigation Generation

**Example: Tab + Stack Navigation**

```typescript
// src/navigation/index.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { AuthScreen } from '../screens/AuthScreen';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

```typescript
// src/navigation/TabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, any> = {
            Home: focused ? 'home' : 'home-outline',
            Chat: focused ? 'chatbubble' : 'chatbubble-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

#### 3. Screen Generation

**Example: Dating Coach Chat Screen**

```typescript
// src/screens/ChatScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../hooks/useChat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatScreen() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChat();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      await sendMessage(input);
      setInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dating Coach AI</Text>
        <Text style={styles.headerSubtitle}>Ask me anything about dating</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.role === 'user' ? styles.userText : styles.aiText,
              ]}
            >
              {item.content}
            </Text>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask your dating coach..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#1f2937',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
```

#### 4. API Integration

```typescript
// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.yourapp.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export const chatApi = {
  sendMessage: async (message: string) => {
    const response = await api.post('/chat', { message });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/chat/history');
    return response.data;
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('auth_token', response.data.token);
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    await AsyncStorage.setItem('auth_token', response.data.token);
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
  },
};

export default api;
```

---

## Expo Integration

### Why Expo?

**Benefits:**
- ✅ **No Mac needed** - Build iOS apps from Linux/Windows
- ✅ **Cloud builds** - EAS Build handles everything
- ✅ **OTA updates** - Update apps without store approval
- ✅ **Easy native features** - Camera, location, etc work out of box
- ✅ **Managed workflow** - Less config, more productivity

### app.json Configuration

```json
{
  "expo": {
    "name": "Dating Coach",
    "slug": "dating-coach",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2563eb"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourname.datingcoach",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "We need camera access for profile photos",
        "NSPhotoLibraryUsageDescription": "We need photo library access to upload photos",
        "NSLocationWhenInUseUsageDescription": "We use your location to find nearby matches"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2563eb"
      },
      "package": "com.yourname.datingcoach",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera"
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location"
        }
      ],
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#2563eb"
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    },
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

### eas.json Configuration

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "ios": {
        "buildType": "app-store"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "123456789",
        "appleTeamId": "ABCD1234"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

## Cloud Build System

### Build Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│            User Triggers Build (from phone)              │
│            "Build iOS version of my app"                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend API Handler                      │
│                                                          │
│  1. Validate project files                              │
│  2. Generate build config                               │
│  3. Increment version numbers                           │
│  4. Call EAS Build API                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              EAS Build Service (Expo)                    │
│                                                          │
│  ┌──────────────────────────────────────────┐          │
│  │       Build Queue Management             │          │
│  │  - Queues iOS and Android builds         │          │
│  │  - Allocates VM resources                │          │
│  └──────────────┬───────────────────────────┘          │
│                 │                                        │
│                 ├──────────┐                            │
│                 ▼          ▼                            │
│   ┌──────────────────┐  ┌──────────────────┐          │
│   │  iOS Build VM    │  │ Android Build VM │          │
│   │  (macOS Sonoma)  │  │ (Ubuntu 22.04)   │          │
│   │                  │  │                  │          │
│   │ Steps:           │  │ Steps:           │          │
│   │ 1. npm install   │  │ 1. npm install   │          │
│   │ 2. Compile TS    │  │ 2. Compile TS    │          │
│   │ 3. Bundle JS     │  │ 3. Bundle JS     │          │
│   │ 4. CocoaPods     │  │ 4. Gradle build  │          │
│   │ 5. Xcode build   │  │ 5. Sign APK/AAB  │          │
│   │ 6. Code signing  │  │ 6. Upload        │          │
│   │ 7. Create IPA    │  │                  │          │
│   │ 8. Upload        │  │                  │          │
│   └──────────────────┘  └──────────────────┘          │
│                 │          │                            │
└─────────────────┼──────────┼────────────────────────────┘
                  │          │
                  ▼          ▼
┌─────────────────────────────────────────────────────────┐
│               Build Artifacts Storage                    │
│                                                          │
│  iOS: app-123-v1.0.0.ipa (125 MB)                       │
│  Android: app-123-v1.0.0.aab (45 MB)                    │
│  Logs: build-123.log                                    │
│  QR codes generated                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Distribution Channels                         │
│                                                          │
│  - TestFlight (iOS)                                     │
│  - Google Play Internal Testing (Android)               │
│  - Direct download links (internal)                     │
│  - QR codes for easy install                            │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│          Notification to User                            │
│                                                          │
│  📱 "Your app is ready!"                                │
│  - iOS: Scan QR or open TestFlight link                │
│  - Android: Scan QR or download APK                     │
│  - Build time: 12 minutes                               │
└─────────────────────────────────────────────────────────┘
```

### Backend Build API

```typescript
// backend/src/routes/builds.ts
import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { db } from '../db';
import { notifyUser } from '../services/notifications';

const execAsync = promisify(exec);
const router = Router();

interface BuildRequest {
  projectId: string;
  platform: 'ios' | 'android' | 'all';
  profile: 'development' | 'preview' | 'production';
}

router.post('/build', async (req, res) => {
  const { projectId, platform, profile }: BuildRequest = req.body;
  const userId = req.user.id;

  try {
    // 1. Validate project exists and user owns it
    const project = await db.projects.findOne({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // 2. Create build record
    const build = await db.builds.create({
      projectId,
      userId,
      platform,
      profile,
      status: 'queued',
      createdAt: new Date(),
    });

    // 3. Trigger EAS Build
    const easCommand = `eas build --platform ${platform} --profile ${profile} --non-interactive --no-wait`;

    // Execute in project directory
    const projectPath = `/app/projects/${projectId}/mobile`;
    const { stdout, stderr } = await execAsync(easCommand, {
      cwd: projectPath,
      env: {
        ...process.env,
        EXPO_TOKEN: process.env.EXPO_ACCESS_TOKEN,
      },
    });

    // 4. Parse EAS build ID from output
    const buildIdMatch = stdout.match(/Build ID: ([\w-]+)/);
    const easBuildId = buildIdMatch ? buildIdMatch[1] : null;

    if (easBuildId) {
      await db.builds.update({
        where: { id: build.id },
        data: { easBuildId, status: 'building' },
      });
    }

    // 5. Start polling for build status
    pollBuildStatus(build.id, easBuildId);

    res.json({
      success: true,
      buildId: build.id,
      easBuildId,
      message: 'Build started. You will be notified when complete.',
    });

  } catch (error) {
    console.error('Build error:', error);
    res.status(500).json({ error: 'Failed to start build' });
  }
});

// Poll EAS for build status
async function pollBuildStatus(buildId: string, easBuildId: string) {
  const maxAttempts = 60; // 30 minutes with 30s intervals
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    try {
      // Check EAS build status
      const { stdout } = await execAsync(
        `eas build:view ${easBuildId} --json`
      );
      const buildInfo = JSON.parse(stdout);

      const status = buildInfo.status; // 'finished' | 'errored' | 'canceled' | 'in-progress'

      if (status === 'finished') {
        // Build succeeded
        await db.builds.update({
          where: { id: buildId },
          data: {
            status: 'success',
            artifactUrl: buildInfo.artifacts?.buildUrl,
            completedAt: new Date(),
          },
        });

        // Notify user
        const build = await db.builds.findUnique({
          where: { id: buildId },
          include: { user: true, project: true },
        });

        await notifyUser(build.userId, {
          title: '🎉 Build Complete!',
          body: `Your ${build.project.name} app is ready to test`,
          data: {
            buildId: build.id,
            downloadUrl: buildInfo.artifacts?.buildUrl,
          },
        });

        clearInterval(interval);

      } else if (status === 'errored' || status === 'canceled') {
        // Build failed
        await db.builds.update({
          where: { id: buildId },
          data: {
            status: 'failed',
            error: buildInfo.error?.message || 'Build failed',
            completedAt: new Date(),
          },
        });

        clearInterval(interval);
      }

      if (attempts >= maxAttempts) {
        // Timeout
        await db.builds.update({
          where: { id: buildId },
          data: { status: 'timeout', completedAt: new Date() },
        });
        clearInterval(interval);
      }

    } catch (error) {
      console.error('Error polling build status:', error);
    }
  }, 30000); // Check every 30 seconds
}

router.get('/builds/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  const builds = await db.builds.findMany({
    where: { projectId, userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ builds });
});

router.get('/builds/:buildId/download', async (req, res) => {
  const { buildId } = req.params;
  const userId = req.user.id;

  const build = await db.builds.findFirst({
    where: { id: buildId, userId },
  });

  if (!build || !build.artifactUrl) {
    return res.status(404).json({ error: 'Build not found' });
  }

  res.json({
    downloadUrl: build.artifactUrl,
    qrCode: generateQRCode(build.artifactUrl),
    installInstructions: getInstallInstructions(build.platform),
  });
});

export default router;
```

### Build Time Estimates

| Platform | Profile | Average Time | Cost (EAS) |
|----------|---------|--------------|------------|
| iOS | Development | 8-12 min | $0.50 |
| iOS | Production | 12-18 min | $0.50 |
| Android | Development | 5-8 min | $0.30 |
| Android | Production | 8-12 min | $0.30 |
| Both | Production | 15-20 min | $0.80 |

---

## Native Features

### 1. Camera & Photo Library

```typescript
// src/hooks/useCamera.ts
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export function useCamera() {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    return cameraStatus === 'granted' && libraryStatus === 'granted';
  };

  const takePhoto = async () => {
    setIsLoading(true);
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error('Camera permission not granted');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Compress and resize
        const manipulated = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 1000 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        return manipulated.uri;
      }
    } catch (error) {
      console.error('Camera error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromLibrary = async () => {
    setIsLoading(true);
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error('Photo library permission not granted');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const manipulated = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 1000 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        return manipulated.uri;
      }
    } catch (error) {
      console.error('Image picker error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    takePhoto,
    pickFromLibrary,
    isLoading,
  };
}
```

### 2. Location Services

```typescript
// src/hooks/useLocation.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const data: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
      };

      setLocation(data);
      return data;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get location';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const watchLocation = async (callback: (location: LocationData) => void) => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    return await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Or every 10 meters
      },
      (location) => {
        const data: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || 0,
        };
        callback(data);
      }
    );
  };

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    watchLocation,
  };
}
```

### 3. Biometric Authentication

```typescript
// src/hooks/useBiometrics.ts
import { useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useBiometrics() {
  const [isEnrolled, setIsEnrolled] = useState(false);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsEnrolled(enrolled);
    return compatible && enrolled;
  };

  const authenticate = async (reason: string = 'Authenticate to continue') => {
    try {
      const hasSupport = await checkBiometricSupport();
      if (!hasSupport) {
        throw new Error('Biometric authentication not available');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  };

  const enableBiometricLogin = async () => {
    const success = await authenticate('Enable biometric login');
    if (success) {
      await AsyncStorage.setItem('biometric_enabled', 'true');
      return true;
    }
    return false;
  };

  const disableBiometricLogin = async () => {
    await AsyncStorage.removeItem('biometric_enabled');
  };

  const isBiometricEnabled = async () => {
    const enabled = await AsyncStorage.getItem('biometric_enabled');
    return enabled === 'true';
  };

  return {
    isEnrolled,
    checkBiometricSupport,
    authenticate,
    enableBiometricLogin,
    disableBiometricLogin,
    isBiometricEnabled,
  };
}
```

### 4. Push Notifications

```typescript
// src/services/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return null;
  }

  try {
    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-expo-project-id',
    });
    const token = tokenData.data;

    // Send token to backend
    await api.post('/users/push-token', { token });
    await AsyncStorage.setItem('push_token', token);

    // Configure Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563eb',
      });
    }

    return token;

  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

export function useNotifications() {
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  useEffect(() => {
    // Register for push notifications on mount
    registerForPushNotifications();

    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // Listen for notification taps
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        // Handle navigation based on notification data
        console.log('Notification tapped:', data);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const sendLocalNotification = async (title: string, body: string, data?: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  };

  return {
    notification,
    sendLocalNotification,
  };
}
```

---

## Testing & Distribution

### TestFlight (iOS)

**Setup:**
1. Create app in App Store Connect
2. Add testers (email addresses)
3. Upload build via EAS Submit
4. Testers receive email with download link

**Backend automation:**
```typescript
// Auto-submit to TestFlight after successful build
router.post('/builds/:buildId/submit-testflight', async (req, res) => {
  const { buildId } = req.params;

  const build = await db.builds.findUnique({
    where: { id: buildId },
    include: { project: true },
  });

  if (build.platform !== 'ios') {
    return res.status(400).json({ error: 'Only iOS builds can be submitted to TestFlight' });
  }

  try {
    // Submit to TestFlight using EAS Submit
    const { stdout } = await execAsync(
      `eas submit --platform ios --latest`,
      {
        cwd: `/app/projects/${build.projectId}/mobile`,
        env: {
          EXPO_TOKEN: process.env.EXPO_ACCESS_TOKEN,
          EXPO_APPLE_ID: process.env.APPLE_ID,
          EXPO_APPLE_APP_SPECIFIC_PASSWORD: process.env.APPLE_APP_PASSWORD,
        },
      }
    );

    await db.builds.update({
      where: { id: buildId },
      data: {
        testflightStatus: 'submitted',
        testflightSubmittedAt: new Date(),
      },
    });

    res.json({ success: true, message: 'Submitted to TestFlight' });

  } catch (error) {
    console.error('TestFlight submission error:', error);
    res.status(500).json({ error: 'Failed to submit to TestFlight' });
  }
});
```

### Google Play Internal Testing

**Setup:**
1. Create app in Google Play Console
2. Set up internal testing track
3. Add testers (email addresses or Google Groups)
4. Upload AAB via EAS Submit

**Backend automation:**
```typescript
router.post('/builds/:buildId/submit-playstore', async (req, res) => {
  const { buildId } = req.params;

  const build = await db.builds.findUnique({
    where: { id: buildId },
    include: { project: true },
  });

  if (build.platform !== 'android') {
    return res.status(400).json({ error: 'Only Android builds can be submitted to Play Store' });
  }

  try {
    // Submit to Play Store internal testing
    const { stdout } = await execAsync(
      `eas submit --platform android --latest --track internal`,
      {
        cwd: `/app/projects/${build.projectId}/mobile`,
        env: {
          EXPO_TOKEN: process.env.EXPO_ACCESS_TOKEN,
          EXPO_GOOGLE_SERVICE_ACCOUNT_KEY_PATH: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
        },
      }
    );

    await db.builds.update({
      where: { id: buildId },
      data: {
        playStoreStatus: 'submitted',
        playStoreSubmittedAt: new Date(),
      },
    });

    res.json({ success: true, message: 'Submitted to Play Store internal testing' });

  } catch (error) {
    console.error('Play Store submission error:', error);
    res.status(500).json({ error: 'Failed to submit to Play Store' });
  }
});
```

### QR Code Installation

```typescript
import QRCode from 'qrcode';

function generateQRCode(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}

// Mobile UI component
function BuildDownloadScreen({ build }: { build: Build }) {
  const [qrCode, setQRCode] = useState('');

  useEffect(() => {
    if (build.downloadUrl) {
      generateQRCode(build.downloadUrl).then(setQRCode);
    }
  }, [build.downloadUrl]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your app is ready! 🎉</Text>

      {qrCode && (
        <Image
          source={{ uri: qrCode }}
          style={styles.qrCode}
        />
      )}

      <Text style={styles.instructions}>
        {build.platform === 'ios'
          ? 'Scan with Camera app to open in TestFlight'
          : 'Scan with any QR scanner to download APK'}
      </Text>

      <TouchableOpacity
        onPress={() => Linking.openURL(build.downloadUrl)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Download {build.platform === 'ios' ? 'from TestFlight' : 'APK'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## App Store Submission

### iOS App Store Checklist

**Before Submission:**
- [ ] App icon (1024x1024, no transparency)
- [ ] App screenshots (all device sizes)
- [ ] App description and keywords
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] App Store Connect agreement signed
- [ ] Age rating completed
- [ ] Test on real devices

**Using EAS Submit:**
```bash
# Submit to App Store review
eas submit --platform ios --latest

# Provide during submission:
# - Apple ID
# - App-specific password
# - App Store Connect API key (recommended)
```

**Review Process:**
- Typical review time: 24-48 hours
- Common rejection reasons:
  - Missing privacy disclosures
  - Broken features
  - Misleading descriptions
  - Using private APIs

### Android Play Store Checklist

**Before Submission:**
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (minimum 2)
- [ ] App description (short & full)
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] Target audience
- [ ] Store listing complete

**Using EAS Submit:**
```bash
# Submit to Play Store (internal/alpha/beta/production)
eas submit --platform android --latest --track internal

# Tracks:
# - internal: Internal testing (up to 100 testers)
# - alpha: Closed testing
# - beta: Open testing
# - production: Public release
```

**Review Process:**
- Typical review time: Hours to 2 days
- Less strict than Apple
- Common rejection reasons:
  - Misleading store listing
  - Malware/security issues
  - Privacy violations

---

## Implementation Plan

### Week 1-2: Foundation
- [ ] Set up Expo project templates
- [ ] Create React Native code generation prompts for Claude
- [ ] Build project scaffolding system
- [ ] Implement navigation generation (tabs, stack, drawer)

### Week 3-4: Screen Generation
- [ ] Create screen templates (chat, profile, list, detail)
- [ ] Build component library (buttons, inputs, cards)
- [ ] Implement styling system (theme, responsive)
- [ ] Add API integration patterns

### Week 5-6: Native Features
- [ ] Implement camera/photo library hooks
- [ ] Add location services
- [ ] Set up biometric authentication
- [ ] Configure push notifications

### Week 7-8: Build System
- [ ] Integrate EAS Build API
- [ ] Create build queue system
- [ ] Implement build status polling
- [ ] Add build artifacts storage

### Week 9-10: Distribution
- [ ] Set up TestFlight automation
- [ ] Configure Play Store internal testing
- [ ] Build QR code generation
- [ ] Create download/install UI

### Week 11-12: Polish & Testing
- [ ] Test on real devices (iOS & Android)
- [ ] Fix build issues
- [ ] Optimize build times
- [ ] Write documentation
- [ ] Create video tutorials

---

## Cost Analysis

### Development Costs

**Services:**
- EAS Build: $29/month (individual) or $99/month (team)
  - Includes priority builds
  - 30 builds/month included
  - Additional builds: $1 each

**Per-Build Costs:**
| Item | iOS | Android | Both |
|------|-----|---------|------|
| Build time | 12 min | 8 min | 15 min |
| Build cost | $0.50 | $0.30 | $0.80 |
| Storage (3 months) | $0.10 | $0.05 | $0.15 |
| **Total per build** | **$0.60** | **$0.35** | **$0.95** |

**Monthly costs (assuming 100 projects, 50% build mobile):**
- 50 projects × 2 platforms × 3 builds avg = 300 builds/month
- 300 builds × $0.95 = **$285/month**

**Distribution:**
- TestFlight: Free (included with Apple Developer)
- Play Store Internal Testing: Free

**Developer Accounts:**
- Apple Developer: $99/year
- Google Play: $25 one-time

### Pricing Strategy

**Free Tier:**
- 1 mobile build/month
- Development profile only
- QR code install only

**Pro Tier ($29/month):**
- 10 mobile builds/month
- Production builds
- TestFlight + Play Store
- Priority build queue

**Team Tier ($99/month):**
- 50 mobile builds/month
- White-label builds
- Custom bundle IDs
- Dedicated build servers

---

## Dating Coach App Example (End-to-End)

### User Flow

**1. User input (from phone):**
```
"Build me an iOS dating coach app with:
- AI chat that gives dating advice
- Content library with articles and videos
- User profile with photos
- Push notifications for tips
- In-app purchases for premium content
```

**2. AI generates project:**
```
✅ React Native + Expo project created
✅ Bottom tab navigation (Chat, Library, Profile)
✅ Chat screen with Claude integration
✅ Content library with video player
✅ Profile screen with camera integration
✅ Stripe subscription setup
✅ Push notifications configured
✅ App icon and splash screen
⏱️ Generation time: 45 seconds
```

**3. User triggers build:**
```
Tap "Build for iOS" button
→ Backend creates build job
→ EAS Build starts iOS build
→ Build notification shows progress
⏱️ Build time: 12 minutes
```

**4. Build completes:**
```
📱 Notification: "Your Dating Coach app is ready!"

Options:
1. Scan QR code → Opens TestFlight → Install
2. Share TestFlight link → Send to friends
3. Build Android version too
4. Submit to App Store
```

**5. Testing:**
```
Open app on iPhone
✅ Chat with AI coach works
✅ Watch videos in library
✅ Upload profile photo
✅ Receive push notification
✅ Subscribe to premium ($9.99/month)
```

**6. Iterate:**
```
User: "Add a matchmaking algorithm"
AI: Updates code, adds matching screen
User: "Build new version"
⏱️ 12 minutes later: New version in TestFlight
```

**Total time from idea to installed app: ~20 minutes**

---

## Success Metrics

### Technical Metrics
- Build success rate: > 95%
- Average build time: < 15 minutes
- App crash rate: < 1%
- Build queue wait time: < 5 minutes

### User Metrics
- Mobile builds per project: > 40%
- TestFlight adoption: > 60%
- App Store submission: > 20%
- User rating of generated apps: > 4.2/5

### Business Metrics
- Free → Pro conversion (mobile): > 15%
- Monthly builds per paying user: 5-8
- Revenue per mobile build: $3-5
- Churn rate: < 4%/month

---

## Next Steps

### To Start Phase 6:
1. ✅ Complete Phase 1 (PWA) - IN PROGRESS
2. ✅ Complete Phase 2 (Backend generation)
3. Start Phase 6 prerequisites:
   - Sign up for EAS Build
   - Get Apple Developer account
   - Get Google Play Developer account
   - Set up Expo organization
4. Build MVP:
   - React Native code generation
   - Basic screen templates
   - EAS Build integration
   - TestFlight automation

### Timeline
- Prerequisites: 1 week
- MVP: 4-6 weeks
- Full features: 10-12 weeks
- Production ready: 14-16 weeks

---

**That's the full Phase 6 plan. From your phone, generate native iOS/Android apps, build them in the cloud, and distribute them to testers—no Mac, no Xcode, no Android Studio needed.** 🚀📱
