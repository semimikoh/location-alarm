import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { type WebViewNavigation } from 'react-native-webview';
import { LoadingMark, ScreenHeader } from '@/components';
import { AppText } from '@/ui/AppText';
import { space, useAppColors } from '@/ui/theme';

const EDITOR_BASE_URL = 'https://localhost/';
const editorAsset = require('../../assets/editor/index.html');

type EditorState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; html: string };

export default function EditorPreviewScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const [state, setState] = useState<EditorState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Asset.loadAsync(editorAsset)
      .then(([asset]) => {
        if (!asset.localUri) throw new Error('Bundled editor is unavailable');
        return new File(asset.localUri).text();
      })
      .then(
        (html) => {
          if (active) setState({ status: 'ready', html });
        },
        (error: unknown) => {
          console.error('Failed to read bundled editor', error);
          if (active) setState({ status: 'error' });
        },
      );
    return () => {
      active = false;
    };
  }, [attempt]);

  function allowLocalNavigation(request: WebViewNavigation): boolean {
    return (
      request.url === 'about:blank' || request.url.startsWith(EDITOR_BASE_URL)
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <ScreenHeader
        title="내장 웹 확인"
        leading={{ label: '뒤로', onPress: () => router.back() }}
      />
      {state.status === 'loading' ? (
        <View style={styles.center}>
          <LoadingMark message="내장 화면을 불러오고 있어요" />
        </View>
      ) : state.status === 'error' ? (
        <View style={styles.center}>
          <LoadingMark
            error="내장 화면을 읽지 못했어요"
            onRetry={() => {
              setState({ status: 'loading' });
              setAttempt((value) => value + 1);
            }}
          />
        </View>
      ) : (
        <WebView
          style={styles.webview}
          source={{ html: state.html, baseUrl: EDITOR_BASE_URL }}
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={allowLocalNavigation}
          javaScriptCanOpenWindowsAutomatically={false}
          setSupportMultipleWindows={false}
          injectedJavaScript={`(function () {
            var form = document.querySelector('.editor-form');
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'EDITOR_LOADED',
              origin: window.location.origin,
              href: window.location.href,
              hasForm: Boolean(form),
              background: form ? getComputedStyle(form).backgroundColor : null
            }));
          })(); true;`}
          onMessage={(event) => {
            try {
              const message = JSON.parse(event.nativeEvent.data);
              if (message.type !== 'EDITOR_LOADED') return;
              console.info('Bundled editor loaded', message);
              setOrigin(message.origin);
            } catch (error) {
              console.warn('Invalid editor message', error);
            }
          }}
          onError={(event) => {
            console.error('Bundled editor WebView failed', event.nativeEvent);
            setState({ status: 'error' });
          }}
        />
      )}
      {origin ? (
        <View style={styles.origin}>
          <AppText variant="caption" color="textMuted">
            WebView origin: {origin}
          </AppText>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, justifyContent: 'center' },
  webview: { flex: 1 },
  origin: { paddingHorizontal: space[4], paddingVertical: space[2] },
});
