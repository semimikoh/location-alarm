import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ALARM_RADIUS, WEEKDAYS, type Weekday } from '@location-alarm/shared';
import './EditorComponents.css';

export type Place = {
  id: string;
  name: string;
  detail: string;
  latitude: number;
  longitude: number;
};

export type SearchState =
  'idle' | 'loading' | 'results' | 'empty' | 'error' | 'offline';
export type MapStatus = 'ready' | 'loading' | 'error' | 'offline';

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'destructive';
  busy?: boolean;
  busyLabel?: string;
};

export function ActionButton({
  variant = 'primary',
  busy = false,
  busyLabel = '처리 중…',
  disabled,
  children,
  className = '',
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={`action-button action-button--${variant} ${className}`}
      disabled={disabled || busy}
      aria-busy={busy}
      {...props}
    >
      {busy ? busyLabel : children}
    </button>
  );
}

export function ScreenHeader({
  title,
  onCancel,
  secondary,
}: {
  title: string;
  onCancel?: () => void;
  secondary?: ReactNode;
}) {
  return (
    <header className="screen-header">
      <h1>{title}</h1>
      <div className="screen-header__actions">
        {secondary}
        {onCancel ? (
          <button type="button" className="text-action" onClick={onCancel}>
            취소
          </button>
        ) : null}
      </div>
    </header>
  );
}

export function FixedActionBar({ children }: { children: ReactNode }) {
  return <footer className="fixed-action-bar">{children}</footer>;
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  type?: 'text' | 'search' | 'number';
  inputMode?: 'text' | 'decimal';
  maxLength?: number;
  disabled?: boolean;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  type = 'text',
  inputMode,
  maxLength,
  disabled,
}: TextFieldProps) {
  const descriptionId = error || hint ? `${id}-description` : undefined;
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="field__input"
        type={type}
        inputMode={inputMode}
        step={type === 'number' ? 'any' : undefined}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p className="field__message field__message--error" id={descriptionId}>
          {error}
        </p>
      ) : hint ? (
        <p className="field__message" id={descriptionId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

export function DayPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: readonly Weekday[];
  onChange: (days: Weekday[]) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="day-picker" disabled={disabled}>
      <legend className="field__label">반복 요일</legend>
      <div className="day-picker__days">
        {WEEKDAYS.map((day) => {
          const selected = value.includes(day);
          return (
            <label
              className={
                selected ? 'day-picker__day is-selected' : 'day-picker__day'
              }
              key={day}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() =>
                  onChange(
                    selected
                      ? value.filter((item) => item !== day)
                      : [...value, day].sort((a, b) => a - b),
                  )
                }
              />
              <span>{dayLabels[day]}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function TimeWindowField({
  start,
  end,
  onStartChange,
  onEndChange,
  error,
  disabled = false,
}: {
  start: string;
  end: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <fieldset
      className="time-window"
      disabled={disabled}
      aria-describedby={error ? `${id}-error` : `${id}-hint`}
    >
      <legend className="field__label">울릴 시간대</legend>
      <div className="time-window__inputs">
        <label htmlFor={`${id}-start`}>
          시작{' '}
          <input
            id={`${id}-start`}
            type="time"
            value={start}
            onChange={(event) => onStartChange(event.target.value)}
            aria-invalid={Boolean(error)}
          />
        </label>
        <span aria-hidden="true">–</span>
        <label htmlFor={`${id}-end`}>
          종료{' '}
          <input
            id={`${id}-end`}
            type="time"
            value={end}
            onChange={(event) => onEndChange(event.target.value)}
            aria-invalid={Boolean(error)}
          />
        </label>
      </div>
      <p
        className={
          error ? 'field__message field__message--error' : 'field__message'
        }
        id={error ? `${id}-error` : `${id}-hint`}
      >
        {error ?? '이 시간 밖에서는 알람이 울리지 않아요.'}
      </p>
    </fieldset>
  );
}

export function RadiusSlider({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (meters: number) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="radius-slider">
      <div className="radius-slider__heading">
        <label className="field__label" htmlFor={id}>
          반경
        </label>
        <output htmlFor={id}>{value.toLocaleString()}m</output>
      </div>
      <input
        id={id}
        type="range"
        min={ALARM_RADIUS.min}
        max={ALARM_RADIUS.max}
        step="100"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={`${value}미터`}
      />
      <div className="radius-slider__limits">
        <span>{ALARM_RADIUS.min}m</span>
        <span>{ALARM_RADIUS.max.toLocaleString()}m</span>
      </div>
    </div>
  );
}

export function RepeatToggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="repeat-toggle">
      <div>
        <label className="field__label" htmlFor={id}>
          매주 반복
        </label>
        <p>
          {checked
            ? '선택한 요일과 시간에 울려요.'
            : '한 번 울린 뒤 자동으로 꺼져요.'}
        </p>
      </div>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  );
}

export function StatusBanner({
  tone,
  title,
  description,
  actionLabel,
  onAction,
  onDismiss,
}: {
  tone: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <div
      className={`status-banner status-banner--${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
      {onDismiss ? (
        <button
          className="status-banner__dismiss"
          type="button"
          onClick={onDismiss}
          aria-label="안내 닫기"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export function MapState({
  status,
  placeName,
  radius,
  onRetry,
}: {
  status: MapStatus;
  placeName: string;
  radius: number;
  onRetry?: () => void;
}) {
  return (
    <div
      className={`map-state map-state--${status}`}
      role={status === 'loading' ? 'status' : undefined}
      aria-label={status === 'ready' ? '선택 위치 지도 미리보기' : undefined}
    >
      {status === 'ready' ? (
        <>
          <div className="map-state__grid" aria-hidden="true" />
          {placeName ? (
            <>
              <div
                className="map-state__radius"
                style={{
                  width: `${Math.min(168, 64 + radius / 20)}px`,
                  height: `${Math.min(168, 64 + radius / 20)}px`,
                }}
                aria-hidden="true"
              />
              <span className="map-state__pin" aria-hidden="true">
                ●
              </span>
              <span className="map-state__tag">{placeName}</span>
            </>
          ) : (
            <span className="map-state__message">장소를 선택해 주세요.</span>
          )}
          <span className="map-state__caption">
            지도 미리보기 · 실제 지도는 추후 연결
          </span>
        </>
      ) : (
        <div className="map-state__fallback">
          <strong>
            {status === 'loading'
              ? '지도를 불러오는 중이에요'
              : status === 'offline'
                ? '오프라인이에요'
                : '지도를 불러오지 못했어요'}
          </strong>
          <p>
            {status === 'loading'
              ? '장소 검색이나 좌표 입력은 계속 사용할 수 있어요.'
              : status === 'offline'
                ? '저장된 장소 또는 수동 좌표를 선택해 주세요.'
                : '검색 결과나 수동 좌표로 알람을 만들 수 있어요.'}
          </p>
          {status === 'error' && onRetry ? (
            <button type="button" onClick={onRetry}>
              지도 다시 시도
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

type PlacePickerProps = {
  mapState: MapStatus;
  placeName: string;
  latitude: number | null;
  longitude: number | null;
  radius: number;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  searchState: SearchState;
  searchResults: readonly Place[];
  savedPlaces: readonly Place[];
  onSelectPlace: (place: Place) => void;
  manualLatitude: string;
  manualLongitude: string;
  onManualLatitudeChange: (value: string) => void;
  onManualLongitudeChange: (value: string) => void;
  onUseManualCoordinates: () => void;
  manualError?: string;
  onMapRetry?: () => void;
};

export function PlacePicker(props: PlacePickerProps) {
  const {
    mapState,
    placeName,
    latitude,
    longitude,
    radius,
    searchQuery,
    onSearchQueryChange,
    searchState,
    searchResults,
    savedPlaces,
    onSelectPlace,
    manualLatitude,
    manualLongitude,
    onManualLatitudeChange,
    onManualLongitudeChange,
    onUseManualCoordinates,
    manualError,
    onMapRetry,
  } = props;
  return (
    <section className="place-picker" aria-labelledby="place-picker-title">
      <h2 id="place-picker-title">알람 장소</h2>
      <MapState
        status={mapState}
        placeName={placeName}
        radius={radius}
        onRetry={onMapRetry}
      />
      {latitude !== null && longitude !== null ? (
        <p className="place-picker__selected">
          선택한 위치: <strong>{placeName}</strong>{' '}
          <span>
            ({latitude.toFixed(4)}, {longitude.toFixed(4)})
          </span>
        </p>
      ) : (
        <p className="place-picker__selected">아직 위치를 선택하지 않았어요.</p>
      )}
      {searchState !== 'offline' ? (
        <>
          <TextField
            id="place-search"
            type="search"
            label="장소 검색"
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="장소 이름을 입력하세요"
          />
          {searchState === 'loading' ? (
            <p className="place-picker__feedback" role="status">
              검색 중이에요…
            </p>
          ) : null}
          {searchState === 'empty' ? (
            <p className="place-picker__feedback" role="status">
              검색 결과가 없어요. 다른 이름이나 수동 좌표를 입력해 주세요.
            </p>
          ) : null}
          {searchState === 'error' ? (
            <p className="place-picker__feedback" role="alert">
              검색할 수 없어요. 수동 좌표를 입력해 주세요.
            </p>
          ) : null}
          {searchState === 'results' ? (
            <PlaceList
              title="검색 결과"
              places={searchResults}
              selected={placeName}
              onSelect={onSelectPlace}
            />
          ) : null}
        </>
      ) : (
        <PlaceList
          title="저장된 장소"
          places={savedPlaces}
          selected={placeName}
          onSelect={onSelectPlace}
        />
      )}
      <div className="manual-coordinates">
        <h3>좌표 직접 입력</h3>
        <div className="manual-coordinates__fields">
          <TextField
            id="manual-latitude"
            type="number"
            inputMode="decimal"
            label="위도"
            value={manualLatitude}
            onChange={onManualLatitudeChange}
            placeholder="37.4981"
          />
          <TextField
            id="manual-longitude"
            type="number"
            inputMode="decimal"
            label="경도"
            value={manualLongitude}
            onChange={onManualLongitudeChange}
            placeholder="127.0276"
          />
        </div>
        {manualError ? (
          <p className="field__message field__message--error" role="alert">
            {manualError}
          </p>
        ) : null}
        <ActionButton
          type="button"
          variant="secondary"
          onClick={onUseManualCoordinates}
        >
          이 좌표 사용
        </ActionButton>
      </div>
    </section>
  );
}

function PlaceList({
  title,
  places,
  selected,
  onSelect,
}: {
  title: string;
  places: readonly Place[];
  selected: string;
  onSelect: (place: Place) => void;
}) {
  return (
    <div className="place-list">
      <h3>{title}</h3>
      <ul>
        {places.map((place) => (
          <li key={place.id}>
            <button
              type="button"
              className={
                selected === place.name
                  ? 'place-list__item is-selected'
                  : 'place-list__item'
              }
              aria-pressed={selected === place.name}
              onClick={() => onSelect(place)}
            >
              <strong>{place.name}</strong>
              <span>{place.detail}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
