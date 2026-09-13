function formatUptime(totalSeconds) {
  const seconds = Math.max(0, Number(totalSeconds) || 0);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
}

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

async function loadStatus() {
  const card = document.getElementById('status-card');
  try {
    const response = await fetch('/api/status', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Status request failed');
    const { data } = await response.json();
    setText('application-status', data.status === 'operational' ? 'Operational' : data.status);
    setText('status-message', `${data.application} is responding normally.`);
    setText('environment', data.environment);
    setText('version', data.version);
    setText('uptime', formatUptime(data.uptimeSeconds));
    setText('updated', new Date(data.timestamp).toLocaleTimeString());
  } catch (error) {
    card.classList.add('is-error');
    setText('application-status', 'Status unavailable');
    setText('status-message', 'The dashboard could not reach the application API.');
  }
}

loadStatus();
