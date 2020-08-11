
class RGBAValue {
	constructor(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		return this.toString();
	}

	toString() {
		return 'rgba(' +
			this.r + ',' +
			this.g + ',' +
			this.b + ',' +
			this.a / 255 + ')'; 
	}
}

class Particle {
	constructor(x, y, r, c, velX = 0, velY = 0) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = c;
		this.velX = velX;
		this.velY = velY;
		this.id = Math.random();
	}

	move() {
		this.x += this.velX;
		this.y += this.velY;

		// Bounce off walls

		if (this.x - this.r < 0) {
			this.x = this.r;
			this.velX *= -1;
		}

		if (this.y - this.r < 0) {
			this.y = this.r;
			this.velY *= -1;
		}

		if (this.x + this.r > canvas.width) {
			this.x = canvas.width - this.r;
			this.velX *= -1;
		}

		if (this.y + this.r > canvas.height) {
			this.y = canvas.height - this.r;
			this.velY *= -1;
		}
	}

	draw(con) {
		con.fillStyle = this.c;
		con.beginPath();
		con.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		con.fill();
	}
}

const canvas = document.getElementById('viewport');
const context = canvas.getContext('2d');
const mouse = {};
const particles = [];

let selectedParticle = null;

function start() {
	resize();
	for (let i = 0; i < 500; i++) {
		particles.push(new Particle(
			randi(0, canvas.width),
			randi(0, canvas.height),
			randi(15, 35),
			new RGBAValue(255, 0, 0, 255)
		));
	}
	requestAnimationFrame(loop);
}

function loop() {
	requestAnimationFrame(loop);

	context.fillStyle = 'rgba(255, 255, 255, 1)';
	context.fillRect(0, 0, canvas.width, canvas.height);

	if (selectedParticle != null) {
		selectedParticle.x = mouse.x;
		selectedParticle.y = mouse.y;
	}

	particles.forEach(particle => {
		particles.forEach(target => {
			if (target.id != particle.id) {
				if (collides(target, particle)) {
					const deltaX = target.x - particle.x;
					const deltaY = target.y - particle.y;
					const deltaR = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
					const overlap = (deltaR - particle.r - target.r) / 2;

					particle.x -= overlap * (particle.x - target.x) / deltaR;
					particle.y -= overlap * (particle.y - target.y) / deltaR;

					target.x += overlap * (particle.x - target.x) / deltaR;
					target.y += overlap * (particle.y - target.y) / deltaR;
				}
			}
		});

		particle.move();
		particle.draw(context);
	});
}

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

// Input

function mousemove(e) {
	mouse.x = e.x;
	mouse.y = e.y;
}

function mousedown(e) {
	mouse.down = true;

	particles.forEach(particle => {
		if (contains(particle, mouse.x, mouse.y)) {
			selectedParticle = particle;
		}
	});
}

function mouseup(e) {
	mouse.down = false;

	selectedParticle = null;
}

// Utils

function rands() {
	return Math.random() < 0.5 ? -1 : 1;
}

function randi(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function contains(circle, x, y) {
	const dx = circle.x - x;
	const dy = circle.y - y;
	const hyp = Math.sqrt(dx * dx + dy * dy);
	if (hyp < circle.r) {
		return true;
	} else {
		return false;
	}
}

function collides(circle1, circle2) {
	const dx = circle1.x - circle2.x;
	const dy = circle1.y - circle2.y;
	const hyp = Math.sqrt(dx * dx + dy * dy);
	const radii = circle1.r + circle2.r;
	if (hyp < radii) {
		return true;
	} else {
		return false;
	}
}

window.onload = start;
window.onresize = resize;
window.onmousemove = mousemove;
window.onmousedown = mousedown;
window.onmouseup = mouseup;