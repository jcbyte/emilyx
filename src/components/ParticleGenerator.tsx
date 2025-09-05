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
		let generatorInterval: NodeJS.Timeout | null = null;

		function generateParticle() {
			const particleId = uuidv4();
			setParticles((prev) => ({ ...prev, [particleId]: Particle }));
		}

		function beginGeneration() {
			generateParticle();
			generatorInterval = setInterval(generateParticle, emissionRate);
		}

		const initialTimeout = setTimeout(beginGeneration, delay);

		return () => {
			clearTimeout(initialTimeout);
			if (generatorInterval) clearInterval(generatorInterval);
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
