$(function () {
  $('#signupForm').on('submit', async function (event) {
    event.preventDefault()
    const payload = {
      username: $('#username').val().trim(),
      firstname: $('#firstname').val().trim(),
      lastname: $('#lastname').val().trim(),
      password: $('#password').val()
    }
    $('#signupMessage').text('')

    if (!payload.username || !payload.firstname || !payload.lastname || !payload.password) {
      $('#signupMessage').text('Please fill in all fields')
      return
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        $('#signupMessage').text(data.message || 'Signup failed')
        return
      }
      window.location.href = '/view/login.html'
    } catch (err) {
      $('#signupMessage').text('Signup failed')
    }
  })
})
