import { useEffect, useRef, useState } from 'react';
import {
  ALARM_RADIUS,
  validateAlarmDraft,
  WEEKDAYS,
  type Alarm,
  type AlarmDraft,
  type AlarmDraftErrors,
  type Weekday,
} from '@location-alarm/shared';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActionButton,
  LoadingMark,
  ScreenHeader,
  StatusBanner,
} from '@/components';
import {
  AlarmValidationError,
  createAlarm,
  getAlarm,
  updateAlarm,
} from '@/db/alarm-repository';
import { AppText } from '@/ui/AppText';
import { radius, space, useAppColors } from '@/ui/theme';

type FormValues = {
  label: string;
  placeName: string;
  latitude: string;
  longitude: string;
  radius: string;
  repeat: boolean;
  repeatDays: Weekday[];
  windowStart: string;
  windowEnd: string;
  enabled: boolean;
  soundId: string;
  vibrate: boolean;
};

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'] as const;

function emptyForm(): FormValues {
  return {
    label: '',
    placeName: '',
    latitude: '',
    longitude: '',
    radius: String(ALARM_RADIUS.default),
    repeat: true,
    repeatDays: [1, 2, 3, 4, 5],
    windowStart: '07:00',
    windowEnd: '10:00',
    enabled: true,
    soundId: 'default',
    vibrate: true,
  };
}

function formFromAlarm(alarm: Alarm): FormValues {
  return {
    label: alarm.label,
    placeName: alarm.placeName,
    latitude: String(alarm.latitude),
    longitude: String(alarm.longitude),
    radius: String(alarm.radius),
    repeat: alarm.repeat,
    repeatDays: alarm.repeat ? alarm.repeatDays : [1, 2, 3, 4, 5],
    windowStart: alarm.repeat ? alarm.windowStart : '07:00',
    windowEnd: alarm.repeat ? alarm.windowEnd : '10:00',
    enabled: alarm.enabled,
    soundId: alarm.soundId,
    vibrate: alarm.vibrate,
  };
}

function coordinate(value: string): number | null {
  return value.trim() === '' ? null : Number(value);
}

function toDraft(form: FormValues, id: string | null): AlarmDraft {
  const fields = {
    id,
    label: form.label,
    placeName: form.placeName,
    latitude: coordinate(form.latitude),
    longitude: coordinate(form.longitude),
    radius: Number(form.radius),
    enabled: form.enabled,
    soundId: form.soundId,
    vibrate: form.vibrate,
  };
  return form.repeat
    ? {
        ...fields,
        repeat: true,
        repeatDays: form.repeatDays,
        windowStart: form.windowStart,
        windowEnd: form.windowEnd,
      }
    : {
        ...fields,
        repeat: false,
        repeatDays: [],
        windowStart: null,
        windowEnd: null,
      };
}

export default function AlarmEditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const alarmId = typeof id === 'string' ? id : null;
  const router = useRouter();
  const colors = useAppColors();
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [loading, setLoading] = useState(Boolean(alarmId));
  const [loadError, setLoadError] = useState('');
  const [errors, setErrors] = useState<AlarmDraftErrors>({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!alarmId) return;
    let active = true;
    getAlarm(alarmId).then(
      (alarm) => {
        if (!active) return;
        if (alarm) setForm(formFromAlarm(alarm));
        else setLoadError('알람을 찾을 수 없어요.');
        setLoading(false);
      },
      () => {
        if (!active) return;
        setLoadError('알람을 불러오지 못했어요.');
        setLoading(false);
      },
    );
    return () => {
      active = false;
    };
  }, [alarmId]);

  function change<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors({});
    setSaveError('');
  }

  function toggleDay(day: Weekday) {
    const selected = form.repeatDays.includes(day);
    const days = selected
      ? form.repeatDays.filter((item) => item !== day)
      : [...form.repeatDays, day].sort((a, b) => a - b);
    change('repeatDays', days);
  }

  async function save() {
    if (savingRef.current) return;
    const draft = toDraft(form, alarmId);
    const validationErrors = validateAlarmDraft(draft);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setSaveError('');
    try {
      if (alarmId) await updateAlarm(alarmId, draft);
      else await createAlarm(draft);
      router.back();
    } catch (error) {
      if (error instanceof AlarmValidationError) setErrors(error.errors);
      else setSaveError('알람을 저장하지 못했어요. 다시 시도해 주세요.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <ScreenHeader
        title={alarmId ? '알람 수정' : '알람 추가'}
        leading={{ label: '취소', onPress: () => router.back() }}
      />
      {loadError ? (
        <View style={styles.center}>
          <LoadingMark error={loadError} />
          <ActionButton label="목록으로" onPress={() => router.back()} />
        </View>
      ) : loading ? (
        <View style={styles.center}>
          <LoadingMark message="알람을 불러오고 있어요" />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            <StatusBanner
              tone="info"
              title="수동 좌표 입력"
              description="장소의 위도와 경도를 직접 입력해 저장합니다. 위치 감시는 아직 연결되지 않았어요."
            />
            {saveError ? <StatusBanner tone="error" title={saveError} /> : null}
            <View style={styles.section}>
              <AppText variant="title">알람 정보</AppText>
              <InputField
                label="알람 이름"
                value={form.label}
                onChangeText={(value) => change('label', value)}
                placeholder="예: 회사 앞에서 내리기"
                error={errors.label}
              />
              <InputField
                label="장소 이름"
                value={form.placeName}
                onChangeText={(value) => change('placeName', value)}
                placeholder="예: 강남역 2번 출구"
                error={errors.placeName}
              />
              <InputField
                label="위도"
                value={form.latitude}
                onChangeText={(value) => change('latitude', value)}
                placeholder="37.4979"
                keyboardType="numeric"
                error={errors.latitude}
              />
              <InputField
                label="경도"
                value={form.longitude}
                onChangeText={(value) => change('longitude', value)}
                placeholder="127.0276"
                keyboardType="numeric"
                error={errors.longitude}
              />
              <InputField
                label="반경 (m)"
                value={form.radius}
                onChangeText={(value) => change('radius', value)}
                placeholder="500"
                keyboardType="number-pad"
                hint="200~2000m 사이로 입력해 주세요."
                error={errors.radius}
              />
            </View>
            <View style={styles.section}>
              <View style={styles.repeatRow}>
                <View style={styles.repeatText}>
                  <AppText variant="title">반복 알람</AppText>
                  <AppText variant="caption" color="textMuted">
                    끄면 첫 위치 진입 때 한 번 울립니다.
                  </AppText>
                </View>
                <Switch
                  accessibilityLabel="반복 알람"
                  value={form.repeat}
                  onValueChange={(value) => change('repeat', value)}
                  trackColor={{ true: colors.toggleOn }}
                />
              </View>
              {form.repeat ? (
                <>
                  <AppText variant="label">반복 요일</AppText>
                  <View style={styles.days}>
                    {WEEKDAYS.map((day) => {
                      const selected = form.repeatDays.includes(day);
                      return (
                        <Pressable
                          key={day}
                          accessibilityRole="button"
                          accessibilityLabel={`${dayLabels[day]}요일`}
                          accessibilityState={{ selected }}
                          onPress={() => toggleDay(day)}
                          style={[
                            styles.day,
                            {
                              backgroundColor: selected
                                ? colors.accentInk
                                : colors.surface,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <AppText
                            variant="label"
                            color={selected ? 'onAccent' : 'text'}
                          >
                            {dayLabels[day]}
                          </AppText>
                        </Pressable>
                      );
                    })}
                  </View>
                  {errors.repeatDays ? (
                    <AppText variant="caption" color="danger">
                      {errors.repeatDays}
                    </AppText>
                  ) : null}
                  <InputField
                    label="시작 시각"
                    value={form.windowStart}
                    onChangeText={(value) => change('windowStart', value)}
                    placeholder="07:00"
                    maxLength={5}
                    error={errors.windowStart}
                  />
                  <InputField
                    label="종료 시각"
                    value={form.windowEnd}
                    onChangeText={(value) => change('windowEnd', value)}
                    placeholder="10:00"
                    maxLength={5}
                    hint="HH:mm 형식이며 자정을 넘길 수 없어요."
                    error={errors.windowEnd}
                  />
                </>
              ) : (
                <AppText variant="body" color="textMuted">
                  1회용 알람으로 저장됩니다.
                </AppText>
              )}
            </View>
            <ActionButton
              label={alarmId ? '변경 저장' : '알람 저장'}
              onPress={() => void save()}
              busy={saving}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

type InputFieldProps = Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'placeholder' | 'keyboardType' | 'maxLength'
> & {
  label: string;
  hint?: string;
  error?: string;
};

function InputField({ label, hint, error, ...inputProps }: InputFieldProps) {
  const colors = useAppColors();
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        {...inputProps}
        accessibilityLabel={label}
        autoCorrect={false}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      />
      {error ? (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color="textMuted">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, justifyContent: 'center' },
  content: { padding: space[4], paddingBottom: space[10], gap: space[4] },
  section: { gap: space[3] },
  field: { gap: space[1] },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space[3],
    fontSize: 16,
  },
  repeatRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  repeatText: { flex: 1, gap: space[1] },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  day: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
