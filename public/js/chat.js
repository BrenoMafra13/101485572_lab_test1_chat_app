$(function () {
  const username = localStorage.getItem('chatUsername')
  if (!username) {
    window.location.href = '/view/login.html'
    return
  }

  const rooms = ['Friends room', 'Gaming room', 'Musics room', 'COMP3133 room', 'Movies room']
  let activeRoom = null

  $('#currentUser').text(username)

  const roomList = $('#roomList')
  const userList = $('#userList')
  const groupMessages = $('#groupMessages')
  const groupInput = $('#groupInput')
  const groupButton = $('#groupForm button')

  const renderRooms = () => {
    roomList.empty()
    rooms.forEach((room) => {
      const button = $(`<button class="btn btn-outline-light" data-room="${room}">${room}</button>`)
      if (room === activeRoom) {
        button.addClass('active')
      }
      roomList.append(button)
    })
    if (activeRoom) {
      groupInput.prop('disabled', false).attr('placeholder', 'Type a message')
      groupButton.prop('disabled', false)
    } else {
      groupInput.prop('disabled', true).attr('placeholder', 'Join a room to chat')
      groupButton.prop('disabled', true)
    }
  }

  const loadUsers = async () => {
    const res = await fetch('/api/users')
    const data = await res.json()
    userList.empty()
    data.filter((user) => user.username !== username).forEach((user) => {
      const button = $(`<button class="btn btn-outline-light w-100 mb-2" type="button">${user.username}</button>`)
      userList.append(button)
    })
  }

  const addGroupMessage = (fromUser, message) => {
    const time = new Date().toLocaleTimeString('en-US')
    const line = `<div class="mb-2"><strong>${fromUser}</strong>: ${message} <span class="small">(${time})</span></div>`
    groupMessages.append(line)
  }

  roomList.on('click', 'button', function () {
    activeRoom = $(this).data('room')
    $('#activeRoom').text(activeRoom)
    groupMessages.empty()
    renderRooms()
  })

  $('#leaveRoomBtn').on('click', function () {
    activeRoom = null
    $('#activeRoom').text('')
    groupMessages.empty()
    renderRooms()
  })

  $('#groupForm').on('submit', function (event) {
    event.preventDefault()
    const message = $('#groupInput').val().trim()
    if (!activeRoom || !message) return
    addGroupMessage(username, message)
    $('#groupInput').val('')
  })

  $('#logoutBtn').on('click', function () {
    localStorage.removeItem('chatUsername')
    window.location.href = '/view/login.html'
  })

  renderRooms()
  loadUsers()
})
