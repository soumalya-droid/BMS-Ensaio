# Use OpenJDK 17 as the base image, which is required for the latest Android SDK tools.
FROM openjdk:17-jdk

# Set environment variables for Android SDK
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# Install necessary system packages, including wget, unzip, and git.
RUN apt-get update && \
    apt-get install -y wget unzip git && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Download and install Android SDK command-line tools
RUN wget -O android-sdk.zip "https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip" && \
    unzip android-sdk.zip && \
    rm android-sdk.zip && \
    mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    mv cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest

# Accept Android SDK licenses
RUN yes | sdkmanager --licenses

# Install required Android SDK packages
RUN sdkmanager "platforms;android-33" "build-tools;33.0.1" "platform-tools"

# Install Cordova CLI globally
RUN npm install -g cordova

# Set the working directory
WORKDIR /app

# Copy the application source code
COPY . .

# Install project dependencies
RUN npm install

# Add the Android platform
# The --save flag is not necessary for modern cordova versions
RUN cordova platform add android@12.0.1

# Build the Android application (release version)
RUN cordova build android --release

# The APK will be generated in /app/platforms/android/app/build/outputs/apk/release/
# The user will be instructed to use a volume to get the APK.
CMD ["echo", "Build complete. APK is in platforms/android/app/build/outputs/apk/release/"]
