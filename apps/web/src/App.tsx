import { useState, type FormEvent } from 'react';
import {
  ALARM_RADIUS,
  isValidTimeWindow,
  type AlarmDraft,
  type Weekday,
} from '@location-alarm/shared';
import {
  ActionButton,
  DayPicker,
  FixedActionBar,
  PlacePicker,
  RadiusSlider,
  RepeatToggle,
  ScreenHeader,
  StatusBanner,
  TextField,
  TimeWindowField,
  type MapStatus,
  type Place,
  type SearchState,
} from './components/EditorComponents';
import './App.css';

type Scenario =
  | 'repeat'
  | 'oneOff'
  | 'loading'
  | 'mapError'
  | 'searchEmpty'
  | 'offline'
  | 'saving'
  | 'disabled';
const scenarios: { id: Scenario; label: string }[] = [
  { id: 'repeat', label: '반복' },
  { id: 'oneOff', label: '1회용' },
  { id: 'loading', label: '지도 로딩' },
  { id: 'mapError', label: '지도 실패' },
  { id: 'searchEmpty', label: '검색 결과 없음' },
  { id: 'offline', label: '오프라인' },
  { id: 'saving', label: '저장 중' },
  { id: 'disabled', label: '저장 불가' },
];
const places: Place[] = [
  {
    id: 'gangnam',
    name: '강남역 2번 출구',
    detail: '서울 강남구 강남대로',
    latitude: 37.4981,
    longitude: 127.0276,
  },
  {
    id: 'sangdo',
    name: '상도동 주민센터',
    detail: '저장된 알람',
    latitude: 37.4992,
    longitude: 126.9535,
  },
];

function makeDraft(scenario: Scenario): AlarmDraft {
  const selected =
    scenario === 'disabled' || scenario === 'loading' ? null : places[0];
  const common = {
    id: null,
    label: selected ? '회사 앞에서 내리기' : '',
    placeName: selected?.name ?? '',
    latitude: selected?.latitude ?? null,
    longitude: selected?.longitude ?? null,
    radius: ALARM_RADIUS.default,
    enabled: true,
    soundId: 'default',
    vibrate: true,
  };
  return scenario === 'oneOff'
    ? {
        ...common,
        repeat: false,
        repeatDays: [],
        windowStart: null,
        windowEnd: null,
      }
    : {
        ...common,
        repeat: true,
        repeatDays: [1, 2, 3, 4, 5],
        windowStart: '07:00',
        windowEnd: '10:00',
      };
}

function App() {
  const [scenario, setScenario] = useState<Scenario>('repeat');
  const [draft, setDraft] = useState<AlarmDraft>(() => makeDraft('repeat'));
  const [query, setQuery] = useState('');
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  const [manualError, setManualError] = useState('');
  const [notice, setNotice] = useState('');

  function selectScenario(next: Scenario) {
    setScenario(next);
    setDraft(makeDraft(next));
    setQuery(next === 'searchEmpty' ? '없는 장소' : '');
    setManualLatitude('');
    setManualLongitude('');
    setManualError('');
    setNotice('');
  }
  function selectPlace(place: Place) {
    setDraft((current) => ({
      ...current,
      placeName: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
    }));
    setManualError('');
  }
  function useManualCoordinates() {
    const latitude = Number(manualLatitude);
    const longitude = Number(manualLongitude);
    if (
      !manualLatitude.trim() ||
      !manualLongitude.trim() ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setManualError(
        '위도는 -90~90, 경도는 -180~180 사이의 숫자로 입력해 주세요.',
      );
      return;
    }
    selectPlace({
      id: 'manual',
      name: '직접 입력한 위치',
      detail: `${latitude}, ${longitude}`,
      latitude,
      longitude,
    });
  }
  function toggleRepeat(repeat: boolean) {
    setDraft((current) => {
      const common = { ...current };
      return repeat
        ? {
            ...common,
            repeat: true,
            repeatDays: [1, 2, 3, 4, 5],
            windowStart: '07:00',
            windowEnd: '10:00',
          }
        : {
            ...common,
            repeat: false,
            repeatDays: [],
            windowStart: null,
            windowEnd: null,
          };
    });
  }

  const timeError =
    draft.repeat && !isValidTimeWindow(draft.windowStart, draft.windowEnd)
      ? '종료 시각은 시작 시각보다 늦어야 해요.'
      : undefined;
  const canSave = Boolean(
    draft.label.trim() &&
    draft.latitude !== null &&
    draft.longitude !== null &&
    (!draft.repeat || (draft.repeatDays.length > 0 && !timeError)),
  );
  const searchState: SearchState =
    scenario === 'offline'
      ? 'offline'
      : query.trim() === '없는 장소'
        ? 'empty'
        : query.trim()
          ? 'results'
          : 'idle';
  const mapState: MapStatus =
    scenario === 'loading'
      ? 'loading'
      : scenario === 'mapError'
        ? 'error'
        : scenario === 'offline'
          ? 'offline'
          : 'ready';
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave || scenario === 'saving') return;
    setNotice(
      '미리보기에서 입력값을 확인했어요. 실제 저장 연결은 다음 단계에서 진행합니다.',
    );
  }

  return (
    <div className="preview-page">
      <aside className="preview-controls" aria-label="편집기 상태 미리보기">
        <p className="preview-kicker">C08 · 웹 편집기 컴포넌트</p>
        <h1>편집기 상태 미리보기</h1>
        <p>상태를 선택해 입력과 저장 버튼을 확인할 수 있어요.</p>
        <div className="scenario-list" role="group" aria-label="미리보기 상태">
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                scenario === item.id
                  ? 'scenario-button is-active'
                  : 'scenario-button'
              }
              aria-pressed={scenario === item.id}
              onClick={() => selectScenario(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>
      <div className="editor-shell">
        <form className="editor-form" onSubmit={submit}>
          <ScreenHeader
            title="알람 추가"
            onCancel={() => setNotice('미리보기에서는 화면을 닫지 않아요.')}
          />
          <main className="editor-content">
            {scenario === 'offline' ? (
              <StatusBanner
                tone="warning"
                title="오프라인이에요"
                description="지도와 장소 검색은 잠시 쉴게요. 저장된 장소나 수동 좌표를 사용할 수 있어요."
              />
            ) : null}
            {notice ? (
              <StatusBanner
                tone="info"
                title="미리보기"
                description={notice}
                onDismiss={() => setNotice('')}
              />
            ) : null}
            <PlacePicker
              mapState={mapState}
              placeName={draft.placeName}
              latitude={draft.latitude}
              longitude={draft.longitude}
              radius={draft.radius}
              searchQuery={query}
              onSearchQueryChange={setQuery}
              searchState={searchState}
              searchResults={places}
              savedPlaces={places}
              onSelectPlace={selectPlace}
              manualLatitude={manualLatitude}
              manualLongitude={manualLongitude}
              onManualLatitudeChange={setManualLatitude}
              onManualLongitudeChange={setManualLongitude}
              onUseManualCoordinates={useManualCoordinates}
              manualError={manualError}
            />
            <RadiusSlider
              value={draft.radius}
              onChange={(radius) =>
                setDraft((current) => ({ ...current, radius }))
              }
            />
            <TextField
              id="alarm-label"
              label="알람 이름"
              placeholder="예: 회사 앞에서 내리기"
              value={draft.label}
              onChange={(label) =>
                setDraft((current) => ({ ...current, label }))
              }
              maxLength={60}
            />
            <RepeatToggle checked={draft.repeat} onChange={toggleRepeat} />
            {draft.repeat ? (
              <div className="schedule-fields">
                <DayPicker
                  value={draft.repeatDays}
                  onChange={(repeatDays: Weekday[]) =>
                    setDraft((current) =>
                      current.repeat ? { ...current, repeatDays } : current,
                    )
                  }
                />
                <TimeWindowField
                  start={draft.windowStart}
                  end={draft.windowEnd}
                  error={timeError}
                  onStartChange={(windowStart) =>
                    setDraft((current) =>
                      current.repeat ? { ...current, windowStart } : current,
                    )
                  }
                  onEndChange={(windowEnd) =>
                    setDraft((current) =>
                      current.repeat ? { ...current, windowEnd } : current,
                    )
                  }
                />
              </div>
            ) : (
              <p className="one-off-note">
                요일과 시간대는 쓰지 않아요. 한 번 울린 뒤 자동으로 꺼져요.
              </p>
            )}
          </main>
          <FixedActionBar>
            <ActionButton
              type="submit"
              busy={scenario === 'saving'}
              busyLabel="저장 중…"
              disabled={!canSave || scenario === 'saving'}
            >
              저장
            </ActionButton>
          </FixedActionBar>
        </form>
      </div>
    </div>
  );
}

export default App;
