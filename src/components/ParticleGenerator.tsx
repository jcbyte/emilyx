import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type ParticleOnDieCallback = () => void;
type ParticleComponent = React.FC<{ onDie: ParticleOnDieCallback }>;

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
		let generatorTimeout: NodeJS.Timeout | null = null;

		function beginGeneration() {
			const particleId = uuidv4();
			setParticles((prev) => ({ ...prev, [particleId]: Particle }));

			generatorTimeout = setTimeout(beginGeneration, emissionRate);
		}

		const initialTimeout = setTimeout(beginGeneration, delay);

		return () => {
			clearTimeout(initialTimeout);
			if (generatorTimeout) clearTimeout(generatorTimeout);
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
