$(function () {
  const username = localStorage.getItem('chatUsername')
  if (!username) {
    window.location.href = '/view/login.html'
    return
  }

  const rooms = ['Friends room', 'Gaming room', 'Musics room', 'COMP3133 room', 'Movies room']
  let activeRoom = null

  const roomList = $('#roomList')
  const userList = $('#userList')
  const groupMessages = $('#groupMessages')
  const groupInput = $('#groupInput')
  const groupButton = $('#groupForm button')

  const socket = io()

  const escapeHtml = (value) => $('<div>').text(value).html()

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

  const addGroupMessage = (msg) => {
    const line = `<div class="mb-2"><strong>${escapeHtml(msg.fromUser)}</strong>: ${escapeHtml(msg.message)} <span class="small">(${escapeHtml(msg.dateSent)})</span></div>`
    groupMessages.append(line)
  }

  const loadGroupMessages = async (room) => {
    if (!room) return
    const res = await fetch(`/api/messages/group/${encodeURIComponent(room)}`)
    const data = await res.json()
    groupMessages.empty()
    data.forEach(addGroupMessage)
  }

  roomList.on('click', 'button', function () {
    const nextRoom = $(this).data('room')
    if (activeRoom) {
      socket.emit('leaveRoom', { room: activeRoom })
    }
    activeRoom = nextRoom
    $('#activeRoom').text(activeRoom)
    renderRooms()
    socket.emit('joinRoom', { room: activeRoom })
    loadGroupMessages(activeRoom)
  })

  $('#leaveRoomBtn').on('click', function () {
    if (!activeRoom) return
    socket.emit('leaveRoom', { room: activeRoom })
    activeRoom = null
    $('#activeRoom').text('')
    groupMessages.empty()
    renderRooms()
  })

  $('#groupForm').on('submit', function (event) {
    event.preventDefault()
    const message = $('#groupInput').val().trim()
    if (!activeRoom || !message) return
    socket.emit('groupMessage', { room: activeRoom, fromUser: username, message })
    $('#groupInput').val('')
  })

  $('#logoutBtn').on('click', function () {
    localStorage.removeItem('chatUsername')
    window.location.href = '/view/login.html'
  })

  socket.on('groupMessage', (msg) => {
    if (msg.room !== activeRoom) return
    addGroupMessage(msg)
  })

  renderRooms()
  loadUsers()
})
