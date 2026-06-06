import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type ParticleProps = { onDie: () => void };
type ParticleComponent = React.FC<ParticleProps>;

export default function ParticleGenerator({
	Particle,
	delay = 0,
	emissionRate,
}: {
	Particle: ParticleComponent;
	delay?: number;
	emissionRate: number;
}) {
	const [particles, setParticles] = useState<Record<string, ParticleComponent>>({});

	useEffect(() => {
		let animationFrame: number | null = null;
		let lastEmission = 0;

		function animLoop(currentTime: number) {
			if (currentTime - lastEmission >= emissionRate) {
				const particleId = uuidv4();
				setParticles((prev) => ({ ...prev, [particleId]: Particle }));

				lastEmission = currentTime;
			}

			animationFrame = requestAnimationFrame(animLoop);
		}

		const initialTimeout = setTimeout(() => {
			animationFrame = requestAnimationFrame(animLoop);
		}, delay);

		return () => {
			clearTimeout(initialTimeout);
			if (animationFrame) cancelAnimationFrame(animationFrame);
		};
	}, [Particle, delay, emissionRate]);

	function deleteParticle(particleId: string) {
		setParticles((prev) => {
			const newParticles = { ...prev };
			delete newParticles[particleId];
			return newParticles;
		});
	}

	return (
		<>
			{Object.entries(particles).map(([particleId, ParticleComponent]) => (
				<ParticleComponent
					key={particleId}
					onDie={() => {
						deleteParticle(particleId);
					}}
				/>
			))}
		</>
	);
}
