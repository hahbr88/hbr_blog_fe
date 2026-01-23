import { Button, Container, Divider, Group, Text, Title } from '@mantine/core';
import Image from 'next/image';
import HomeButton from '@/components/buttons/HomeButton';
import BackgroundCanvas from '@/components/main/BackgroundCanvas';

const highlights = [
	'Next.js App Router 기반 서비스 아키텍처 설계 및 운영',
	'Redux Toolkit + Redux-Saga 비동기 처리 구조화',
	'Socket.io, OCR, 결제 SDK 등 외부 연동 중심 기능 구현',
	'입력 지연 최적화 및 UI/UX 개선 경험',
];

const skills = {
	Language: ['Javascript', 'TypeScript', 'Python'],

	Frontend: [
		'React',
		'Next.js',
		'Redux Toolkit',
		'Redux-Saga',
		'Tailwind CSS',
		'Ant Design',
		'Mantine',
	],
	Backend: [
		'NestJS',
		'MySQL',
		'Redis',
		'FastAPI',
		'Postgres',
		'SQLAlchemy',
		'Alembic',
	],
	Infra: ['AWS', 'Docker', 'Git'],
	Etc: ['Socket.io', 'Kakao Maps', 'Toss Payments', 'Naver OCR', 'ChatGPT API'],
};

const experiences = [
	{
		company: '주식회사 팩트앤지',
		period: '2022.12 - 2025.01',
		role: 'FE 팀원',
		title: 'IAO 홈페이지 리뉴얼 및 운영',
		items: [
			'SSR/CSR 혼합 아키텍처 설계',
			'Next.js 13 App Router 기반 페이지/컴포넌트 구조 설계',
			'Redux Toolkit 상태 관리 모듈화',
			'React Hook Form 기반 폼 검증',
			'Framer Motion, Swiper.js로 모션 UI/슬라이더 구현',
			'Debounce/Throttle로 입력 지연 최적화',
		],
		tech: [
			'Next.js',
			'SSR/CSR',
			'Redux Toolkit',
			'React Hook Form',
			'Framer Motion',
			'Swiper.js',
		],
	},
	{
		company: '주식회사 팩트앤지',
		period: '2023.11 - 2025.01',
		role: 'FE 팀원',
		title: '써밋글로벌 번역센터 웹 서비스',
		items: [
			'Next.js App Router 기반 아키텍처 설계 및 개발',
			'Redux Toolkit + Redux-Saga 비동기 처리 모듈화',
			'Ant Design + Tailwind CSS 병행 적용',
			'Socket.io Client 실시간 데이터 연동',
			'PDF/Excel 다운로드, Kakao Maps 커스텀 컴포넌트',
			'Toss Payments 결제 위젯 연동',
			'관리자 페이지 제작',
			'Naver OCR + ChatGPT API 자동 번역/검수 시스템',
		],
		tech: [
			'Next.js',
			'Redux Toolkit',
			'Redux-Saga',
			'Ant Design',
			'Tailwind CSS',
			'Socket.io',
			'Kakao Maps',
			'Toss Payments',
			'Naver OCR',
			'ChatGPT API',
		],
		link: 'https://sseomit.com',
	},
];

const projects = [
	{
		name: 'Resumy - 취준생을 위한 문서관리 웹 서비스',
		items: [
			'채용정보 Open API 기반 카드 그리드 및 D-day 표시',
			'회원가입/로그인, 파일 관리 페이지 UI/UX',
		],
		link: 'https://github.com/seop1284-kr/Resumy',
	},
	{
		name: '댕과사전 - 애견인 커뮤니티 웹 서비스',
		items: [
			'Kakao Maps 기반 지도/마커 모달',
			'게시글 무한 스크롤',
			'모달 아이콘 애니메이션으로 UX 개선',
			'별점 표시 알고리즘 구현',
		],
		link: 'https://github.com/daengtionary/Frontend',
	},
];

export default function AboutMePage() {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%),radial-gradient(circle_at_20%_40%,_rgba(20,83,45,0.4),_transparent_45%),linear-gradient(180deg,_#050706,_#0c0f0c)] text-zinc-100">
			<Container size="lg" className="py-16 sm:py-20">
				<HomeButton  />
				<section className="rounded-2xl border border-[rgba(120,255,160,0.2)] bg-[linear-gradient(180deg,rgba(8,12,8,0.9),rgba(3,6,4,0.92))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
					<div className="flex flex-wrap items-center justify-between gap-6">
						<div className="flex flex-wrap items-center gap-6">
							<div className="relative aspect-[3/4] w-[220px] shrink-0">
								<Image
									fill
									className="rounded-2xl border border-[rgba(120,255,160,0.2)] object-cover"
									src="/imgs/me.png"
									alt="me"
									sizes="220px"
								/>
							</div>
							<div>
								<Title
									order={1}
									className="mt-2 font-mono text-4xl sm:text-5xl"
								>
									하 병 노
								</Title>
								<Text className="mt-3 max-w-2xl text-sm text-zinc-300 leading-relaxed">
									TypeScript와 React 기반의 프론트엔드부터 NestJS를 활용한
									백엔드까지 모던 웹 생태계 전반을 다루는 개발자입니다.
									유지보수성과 확장성을 중시하며, 성능 최적화와 구조적 설계를
									통해 사용자 경험과 개발 효율을 동시에 추구합니다.
								</Text>
							</div>
						</div>
						<Group className="gap-3">
							<Button
								component="a"
								href="mailto:hahbr88@gmail.com"
								variant="terminal"
							>
								메일
							</Button>
							<Button
								component="a"
								href="https://github.com/hahbr88"
								target="_blank"
								rel="noreferrer"
								variant="terminal"
							>
								GitHub
							</Button>
						</Group>
					</div>
					<Divider my="lg" color="rgba(120,255,160,0.15)" />
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="rounded-xl border border-[rgba(120,255,160,0.12)] bg-[rgba(6,12,6,0.6)] p-5">
							<p className="text-[rgba(120,255,160,0.6)] text-xs uppercase tracking-[0.3em]">
								Contact
							</p>
							<Text className="mt-3 font-mono text-sm text-zinc-200">
								+82 10-2247-0507
							</Text>
							<Text className="mt-1 font-mono text-sm text-zinc-200">
								hahbr88@gmail.com
							</Text>
						</div>
						{/* <div className="rounded-xl border border-[rgba(120,255,160,0.12)] bg-[rgba(6,12,6,0.6)] p-5">
							<p className="text-[rgba(120,255,160,0.6)] text-xs uppercase tracking-[0.3em]">
								Highlights
							</p>
							<ul className="mt-3 space-y-2 text-sm text-zinc-300">
								{highlights.map((item) => (
									<li key={item} className="flex gap-2">
										<span className="text-[rgba(120,255,160,0.7)]">▸</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div> */}
					</div>
				</section>

				<section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="space-y-8">
						<div>
							<Title order={2} className="font-mono text-2xl">
								Experience
							</Title>
							<div className="mt-6 space-y-6">
								{experiences.map((exp) => (
									<div
										key={`${exp.company}-${exp.title}`}
										className="rounded-2xl border border-[rgba(120,255,160,0.14)] bg-[rgba(5,9,6,0.72)] p-6"
									>
										<div className="flex flex-wrap items-baseline justify-between gap-3">
											<div>
												<p className="text-[rgba(120,255,160,0.6)] text-xs uppercase tracking-[0.2em]">
													{exp.company}
												</p>
												<Title order={3} className="mt-2 font-mono text-xl">
													{exp.title}
												</Title>
											</div>
											<span className="rounded-full border border-[rgba(120,255,160,0.2)] px-3 py-1 text-xs text-zinc-200">
												{exp.period} · {exp.role}
											</span>
										</div>
										<ul className="mt-4 space-y-2 text-sm text-zinc-300">
											{exp.items.map((item) => (
												<li key={item} className="flex gap-2">
													<span className="text-[rgba(120,255,160,0.7)]">
														—
													</span>
													<span>{item}</span>
												</li>
											))}
										</ul>
										<div className="mt-4 flex flex-wrap gap-2">
											{exp.tech.map((tech) => (
												<span
													key={tech}
													className="rounded-full border border-[rgba(120,255,160,0.2)] bg-[rgba(6,12,6,0.6)] px-3 py-1 text-xs text-zinc-200"
												>
													{tech}
												</span>
											))}
										</div>
										{exp.link ? (
											<div className="mt-4">
												<a
													href={exp.link}
													target="_blank"
													rel="noreferrer"
													className="text-[rgba(120,255,160,0.75)] text-xs underline decoration-transparent transition hover:decoration-[rgba(120,255,160,0.6)]"
												>
													{exp.link}
												</a>
											</div>
										) : null}
									</div>
								))}
							</div>
						</div>

						<div>
							<Title order={2} className="font-mono text-2xl">
								Projects
							</Title>
							<div className="mt-6 grid gap-5 md:grid-cols-2">
								{projects.map((project) => (
									<div
										key={project.name}
										className="rounded-2xl border border-[rgba(120,255,160,0.14)] bg-[rgba(5,9,6,0.72)] p-5"
									>
										<Title order={4} className="font-mono text-lg">
											{project.name}
										</Title>
										<ul className="mt-3 space-y-2 text-sm text-zinc-300">
											{project.items.map((item) => (
												<li key={item} className="flex gap-2">
													<span className="text-[rgba(120,255,160,0.7)]">
														▸
													</span>
													<span>{item}</span>
												</li>
											))}
										</ul>
										<a
											href={project.link}
											target="_blank"
											rel="noreferrer"
											className="mt-4 inline-block text-[rgba(120,255,160,0.75)] text-xs underline decoration-transparent transition hover:decoration-[rgba(120,255,160,0.6)]"
										>
											{project.link}
										</a>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="space-y-8">
						<div className="rounded-2xl border border-[rgba(120,255,160,0.14)] bg-[rgba(5,9,6,0.72)] p-6">
							<Title order={3} className="font-mono text-xl">
								Skills
							</Title>
							<div className="mt-4 space-y-4">
								{Object.entries(skills).map(([group, items]) => (
									<div key={group}>
										<p className="text-[rgba(120,255,160,0.6)] text-xs uppercase tracking-[0.3em]">
											{group}
										</p>
										<div className="mt-2 flex flex-wrap gap-2">
											{items.map((item) => (
												<span
													key={item}
													className="rounded-full border border-[rgba(120,255,160,0.2)] bg-[rgba(6,12,6,0.6)] px-3 py-1 text-xs text-zinc-200"
												>
													{item}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-2xl border border-[rgba(120,255,160,0.14)] bg-[rgba(5,9,6,0.72)] p-6">
							<Title order={3} className="font-mono text-xl">
								Education
							</Title>
							<div className="mt-4 space-y-4 text-sm text-zinc-300">
								<div>
									<p className="font-mono text-zinc-100">가천대학교</p>
									<p>중어중문학과 · 2012.03 - 2017.02</p>
								</div>
								<div>
									<p className="font-mono text-zinc-100">코리아IT아카데미</p>
									<p>AI 활용 소프트웨어 개발 및 응용 · 2021.07 - 2021.12</p>
								</div>
								<div>
									<p className="font-mono text-zinc-100">스파르타코딩클럽</p>
									<p>항해99 프론트엔드 과정 · 2022.07 - 2022.10</p>
								</div>
								<div>
									<p className="font-mono text-zinc-100">
										더조은컴퓨터아카데미
									</p>
									<p>
										실무중심 정보보안 & 클라우드 네트워크 전문가 양성과정 ·
										2025.12 - 2026.7
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-[rgba(120,255,160,0.14)] bg-[rgba(5,9,6,0.72)] p-6">
							<Title order={3} className="font-mono text-xl">
								Certificates & Language
							</Title>
							<ul className="mt-4 space-y-2 text-sm text-zinc-300">
								<li>중국어 2급 정교사 자격</li>
								<li>중국어(북경어) 일상 회화</li>
								<li>영어 일상 회화</li>
							</ul>
						</div>

						<div className="rounded-2xl border border-[rgba(120,255,160,0.14)] bg-[rgba(5,9,6,0.72)] p-6">
							<Title order={3} className="font-mono text-xl">
								Links
							</Title>
							<ul className="mt-4 space-y-2 text-sm text-zinc-300">
								<li>
									GitHub ·{' '}
									<a
										href="https://github.com/hahbr88"
										target="_blank"
										rel="noreferrer"
										className="text-[rgba(120,255,160,0.75)] underline decoration-transparent transition hover:decoration-[rgba(120,255,160,0.6)]"
									>
										https://github.com/hahbr88
									</a>
								</li>
								<li>
									Resumy ·{' '}
									<a
										href="https://github.com/seop1284-kr/Resumy"
										target="_blank"
										rel="noreferrer"
										className="text-[rgba(120,255,160,0.75)] underline decoration-transparent transition hover:decoration-[rgba(120,255,160,0.6)]"
									>
										https://github.com/seop1284-kr/Resumy
									</a>
								</li>
								<li>
									댕과사전 ·{' '}
									<a
										href="https://github.com/daengtionary/Frontend"
										target="_blank"
										rel="noreferrer"
										className="text-[rgba(120,255,160,0.75)] underline decoration-transparent transition hover:decoration-[rgba(120,255,160,0.6)]"
									>
										https://github.com/daengtionary/Frontend
									</a>
								</li>
								<li>
									써밋글로벌 번역센터 ·{' '}
									<a
										href="https://sseomit.com"
										target="_blank"
										rel="noreferrer"
										className="text-[rgba(120,255,160,0.75)] underline decoration-transparent transition hover:decoration-[rgba(120,255,160,0.6)]"
									>
										https://sseomit.com
									</a>
								</li>
							</ul>
						</div>
					</div>
				</section>
			</Container>
			{/* <BackgroundCanvas /> */}
		</div>
	);
}
