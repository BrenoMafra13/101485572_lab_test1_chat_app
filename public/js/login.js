$(function () {
  if (localStorage.getItem('chatUsername')) {
    window.location.href = '/view/chat.html'
    return
  }

  $('#loginForm').on('submit', async function (event) {
    event.preventDefault()
    const payload = {
      username: $('#username').val().trim(),
      password: $('#password').val()
    }
    $('#loginMessage').text('')

    if (!payload.username || !payload.password) {
      $('#loginMessage').text('Please complete all fields')
      return
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        $('#loginMessage').text(data.message || 'Login failed')
        return
      }
      localStorage.setItem('chatUsername', payload.username)
      window.location.href = '/view/chat.html'
    } catch (err) {
      $('#loginMessage').text('Login failed')
    }
  })
})
