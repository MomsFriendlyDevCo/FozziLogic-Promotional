const form = document.querySelector('#interest-form');
const button = form.querySelector('button[type="submit"]');
const confirmation = document.querySelector('#form-confirm');
const error = document.querySelector('#form-error');
const note = document.querySelector('#form-note');
let submitting = false;

document.querySelector('#year').textContent = new Date().getFullYear();

form.addEventListener('submit', async event => {
	event.preventDefault();
	if (submitting || !form.reportValidity()) return;

	submitting = true;
	button.disabled = true;
	button.textContent = 'Sending…';
	form.setAttribute('aria-busy', 'true');
	error.hidden = true;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15000);
	try {
		const response = await fetch(form.action, {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
			body: JSON.stringify(Object.fromEntries(new FormData(form))),
			signal: controller.signal,
		});
		const result = await response.json();
		if (!response.ok || result.registered !== true) throw new Error('Registration was not confirmed');

		form.hidden = true;
		note.hidden = true;
		confirmation.hidden = false;
		confirmation.focus();
	} catch {
		error.hidden = false;
	} finally {
		clearTimeout(timeout);
		submitting = false;
		button.disabled = false;
		button.textContent = 'Keep me posted';
		form.removeAttribute('aria-busy');
	}
});
