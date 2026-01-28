'use client';

import { ActionIcon, Group, Slider, Text } from '@mantine/core';
import {
	IconPlayerPause,
	IconPlayerPlay,
	IconVolume,
	IconVolume2,
	IconVolumeOff,
} from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type AudioPlayerProps = {
	src: string;
	captionsSrc: string;
	title?: string;
	autoPlayMuted?: boolean;
	creditText?: string;
	creditUrl?: string;
	onPlayingChange?: (isPlaying: boolean) => void;
};

export default function AudioPlayer({
	src,
	captionsSrc,
	title = 'BGM',
	autoPlayMuted = true,
	creditText = 'Source',
	creditUrl,
	onPlayingChange,
}: AudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(0.5);
	const [isMuted, setIsMuted] = useState(autoPlayMuted);
	const lastVolumeRef = useRef(0.5);
	const [isSeeking, setIsSeeking] = useState(false);
	const [seekValue, setSeekValue] = useState(0);
	const pendingSeekRef = useRef<number | null>(null);
	const isSeekingRef = useRef(false);
	const syncDuration = useCallback(() => {
		const audio = audioRef.current;
		if (!audio) return;
		const nextDuration = audio.duration;
		if (Number.isFinite(nextDuration) && nextDuration > 0) {
			setDuration(nextDuration);
		}
	}, []);
	const clampTime = (value: number, max: number) =>
		Number.isFinite(max) && max > 0 ? Math.min(Math.max(value, 0), max) : value;

	useEffect(() => {
		isSeekingRef.current = isSeeking;
	}, [isSeeking]);

	const applyPendingSeek = () => {
		const audio = audioRef.current;
		if (!audio) return;
		if (pendingSeekRef.current !== null && duration > 0) {
			const target = clampTime(pendingSeekRef.current, duration);
			audio.currentTime = target;
			setCurrentTime(target);
			pendingSeekRef.current = null;
		}
	};

	const handleTimeUpdate = () => {
		const audio = audioRef.current;
		if (!audio) return;
		if (!isSeekingRef.current) {
			setCurrentTime(audio.currentTime);
		}
	};

	const handleEnd = () => {
		setIsPlaying(false);
	};

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		syncDuration();
		if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
			audio.load();
			let tries = 0;
			const id = window.setInterval(() => {
				syncDuration();
				tries += 1;
				if (
					(Number.isFinite(audio.duration) && audio.duration > 0) ||
					tries >= 20
				) {
					window.clearInterval(id);
				}
			}, 200);
			return () => window.clearInterval(id);
		}
	}, [syncDuration]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.volume = volume;
	}, [volume]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.muted = isMuted;
	}, [isMuted]);

	useEffect(() => {
		const active = isPlaying && !isMuted && volume > 0;
		onPlayingChange?.(active);
	}, [isPlaying, isMuted, onPlayingChange, volume]);

	const autoPlayDoneRef = useRef(false);

	useEffect(() => {
		if (!autoPlayMuted || autoPlayDoneRef.current) return;
		const audio = audioRef.current;
		if (!audio) return;
		autoPlayDoneRef.current = true;
		audio.muted = true;
		audio
			.play()
			.then(() => {
				setIsPlaying(true);
				setIsMuted(true);
			})
			.catch(() => {
				setIsPlaying(false);
			});
	}, [autoPlayMuted]);

	const togglePlay = () => {
		const audio = audioRef.current;
		if (!audio) return;
		if (isPlaying) {
			audio.pause();
			setIsPlaying(false);
		} else {
			audio
				.play()
				.then(() => {
					setIsPlaying(true);
				})
				.catch(() => {
					setIsPlaying(false);
				});
		}
	};

	const toggleMute = () => {
		if (isMuted) {
			const restore = lastVolumeRef.current || 0.5;
			setVolume(restore);
			setIsMuted(false);
		} else {
			if (volume > 0) lastVolumeRef.current = volume;
			setVolume(0);
			setIsMuted(true);
		}
	};

	const handleSeekChange = (value: number) => {
		setIsSeeking(true);
		setSeekValue(value);
		const audio = audioRef.current;
		if (!audio) return;
		if (duration <= 0) {
			pendingSeekRef.current = value;
			return;
		}
		const target = clampTime(value, duration);
		audio.currentTime = target;
		setCurrentTime(target);
	};

	const handleSeekEnd = (value: number) => {
		const audio = audioRef.current;
		if (!audio) return;
		if (duration <= 0) {
			pendingSeekRef.current = value;
			setIsSeeking(false);
			return;
		}
		const target = clampTime(value, duration);
		audio.currentTime = target;
		setCurrentTime(target);
		setSeekValue(target);
		setIsSeeking(false);
	};

	const formatTime = (time: number) => {
		if (!Number.isFinite(time)) return '0:00';
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	const volumeIcon = isMuted
		? IconVolumeOff
		: volume > 0.5
			? IconVolume
			: IconVolume2;
	const VolumeIcon = volumeIcon;

	return (
		<div className="px-5 pt-4 pb-5">
			<audio
				ref={audioRef}
				src={src}
				loop
				preload="auto"
				onLoadedMetadata={() => {
					syncDuration();
					applyPendingSeek();
				}}
				onLoadedData={syncDuration}
				onCanPlay={syncDuration}
				onCanPlayThrough={syncDuration}
				onDurationChange={syncDuration}
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleEnd}
				className="tb2"
			>
				<track
					kind="captions"
					src={captionsSrc}
					srcLang="ko"
					label="Korean"
					default
				/>
			</audio>
			<Group mt="sm" gap="md" align="center" justify="space-between">
				<Group gap="sm" align="center">
					<ActionIcon
						onClick={togglePlay}
						variant="terminal"
						size={36}
						aria-label={isPlaying ? 'Pause' : 'Play'}
					>
						{isPlaying ? (
							<IconPlayerPause size={18} />
						) : (
							<IconPlayerPlay size={18} />
						)}
					</ActionIcon>

					{/* <Text className="font-mono text-[rgba(120,255,160,0.6)]! text-xs">
						{formatTime(currentTime)}
					</Text>
					<Text className="font-mono text-[rgba(120,255,160,0.6)]! text-xs">
						/
					</Text>
					<Text className="font-mono text-[rgba(120,255,160,0.6)]! text-xs">
						{formatTime(duration)}
					</Text> */}
				</Group>
				<Group gap="xs" align="center">
					<ActionIcon
						onClick={toggleMute}
						variant="terminal"
						size={32}
						aria-label={isMuted ? 'Unmute' : 'Mute'}
					>
						<VolumeIcon size={16} />
					</ActionIcon>
					<Slider
						w={96}
						value={isMuted ? 0 : Math.round(volume * 100)}
						onChange={(value) => {
							const nextVolume = value / 100;
							setVolume(nextVolume);
							if (value > 0) {
								lastVolumeRef.current = nextVolume;
								if (isMuted) setIsMuted(false);
							}
							if (value === 0) {
								setIsMuted(true);
							}
						}}
						min={0}
						max={100}
						size="xs"
						styles={{
							track: { backgroundColor: 'rgba(120,255,160,0.12)' },
							bar: { backgroundColor: 'rgba(120,255,160,0.85)' },
							thumb: { borderColor: 'rgba(120,255,160,0.85)' },
						}}
					/>
				</Group>
			</Group>
			<div className="flex flex-wrap">
				<Slider
					className="w-2/3"
					mt="sm"
					value={Math.min(
						isSeeking ? seekValue : currentTime,
						duration > 0 ? duration : 100,
					)}
					onChange={handleSeekChange}
					onChangeEnd={handleSeekEnd}
					min={0}
					max={duration || 100}
					size="sm"
					styles={{
						track: { backgroundColor: 'rgba(120,255,160,0.12)' },
						bar: { backgroundColor: 'rgba(120,255,160,0.85)' },
						thumb: { borderColor: 'rgba(120,255,160,0.85)' },
					}}
				/>
				<div className="">
					<span className="font-mono text-[rgba(120,255,160,0.6)]! text-sm">
						{formatTime(currentTime)}
					</span>
					<span className="font-mono text-[rgba(120,255,160,0.6)]! text-sm">
						/
					</span>
					<span className="font-mono text-[rgba(120,255,160,0.6)]! text-sm">
						{formatTime(duration)}
					</span>
				</div>
			</div>
			{creditUrl ? (
				<a
					href={creditUrl}
					target="_blank"
					rel="noreferrer"
					className="mt-3 block overflow-hidden rounded-md border border-[rgba(120,255,160,0.12)] bg-[rgba(6,12,6,0.55)] px-3 py-1 text-[10px] text-[rgba(120,255,160,0.65)] uppercase tracking-[0.2em]"
				>
					<span className="inline-block animate-[marquee-left_30s_linear_infinite] whitespace-nowrap">
						{creditText}
					</span>
				</a>
			) : null}
		</div>
	);
}
