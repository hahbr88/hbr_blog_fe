'use client';

import { ActionIcon, Group, Slider, Text } from '@mantine/core';
import {
	IconPlayerPause,
	IconPlayerPlay,
	IconVolume,
	IconVolume2,
	IconVolumeOff,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

type AudioPlayerProps = {
	src: string;
	captionsSrc: string;
	title?: string;
	autoPlayMuted?: boolean;
};

export default function AudioPlayer({
	src,
	captionsSrc,
	title = 'BGM',
	autoPlayMuted = true,
}: AudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(0.5);
	const [isMuted, setIsMuted] = useState(autoPlayMuted);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleLoaded = () => {
			setDuration(audio.duration || 0);
		};
		const handleTime = () => {
			setCurrentTime(audio.currentTime);
		};
		const handleEnd = () => {
			setIsPlaying(false);
		};

		audio.addEventListener('loadedmetadata', handleLoaded);
		audio.addEventListener('timeupdate', handleTime);
		audio.addEventListener('ended', handleEnd);

		return () => {
			audio.removeEventListener('loadedmetadata', handleLoaded);
			audio.removeEventListener('timeupdate', handleTime);
			audio.removeEventListener('ended', handleEnd);
		};
	}, []);

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
		if (!autoPlayMuted) return;
		const audio = audioRef.current;
		if (!audio) return;
		audio.muted = true;
		audio.volume = volume;
		audio
			.play()
			.then(() => {
				setIsPlaying(true);
				setIsMuted(true);
			})
			.catch(() => {
				setIsPlaying(false);
			});
	}, [autoPlayMuted, volume]);

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
		setIsMuted((prev) => !prev);
	};

	const handleSeek = (value: number) => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.currentTime = value;
		setCurrentTime(value);
	};

	const formatTime = (time: number) => {
		if (!Number.isFinite(time)) return '0:00';
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	const volumeIcon = isMuted
		? IconVolumeOff
		: volume > 0.6
			? IconVolume2
			: IconVolume;
	const VolumeIcon = volumeIcon;

	return (
		<div className="px-5 pt-4 pb-5">
			<audio ref={audioRef} src={src} loop preload="metadata">
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
					<Text className="font-mono text-[rgba(120,255,160,0.6)]! text-xs">
						{formatTime(currentTime)}
					</Text>
					<Text className="font-mono text-[rgba(120,255,160,0.6)]! text-xs">
						/
					</Text>
					<Text className="font-mono text-[rgba(120,255,160,0.6)]! text-xs">
						{formatTime(duration)}
					</Text>
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
							setIsMuted(value === 0);
							setVolume(value / 100);
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
			<Slider
				mt="sm"
				value={Math.min(currentTime, duration)}
				onChange={handleSeek}
				min={0}
				max={duration || 0}
				size="sm"
				styles={{
					track: { backgroundColor: 'rgba(120,255,160,0.12)' },
					bar: { backgroundColor: 'rgba(120,255,160,0.85)' },
					thumb: { borderColor: 'rgba(120,255,160,0.85)' },
				}}
			/>
		</div>
	);
}
