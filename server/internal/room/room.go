package room

import (
	"tonkatsu-server/internal/game"
	. "tonkatsu-server/internal/model"
)

type RoomID string

// 部屋を表す構造体.
// 部屋の状態の保持, クライアント間のやり取りの仲介
type Room struct {
	id         RoomID
	host       UserID
	subscriber chan *enteredClient
	clients    map[UserID]roomClient
	context    *game.Context
	closer     chan bool
}

// Roomからみたクライアント
type roomClient struct {
	name     string
	sender   chan<- *RoomMessage
	receiver <-chan *ClientMessage
}

// Roomへ送る, 入室したいクライアントの情報
type enteredClient struct {
	id       userID
	name     string
	receiver <-chan *ClientMessage
	sender   chan<- *RoomMessage
}

// NewRoomはユーザがいない部屋を作成する
func NewRoom(roomId RoomID, userId UserID) Room {
	return Room{
		id:         roomId,
		host:       userId,
		subscriber: make(chan *enteredClient, 1),
		clients:    map[UserID]roomClient{},
		context:    game.NewContext(),
		closer:     make(chan bool, 1),
	}
}

func (r *Room) run() {
	defer r.close()
	r.handleMessagesInWaiting()
}

// 待機中に送られてくるメッセージを処理する
func (r *Room) handleMessagesInWaiting() {
	for {
		select {
		case c := <-r.subscriber:
			r.subscribe(c.id, c.name, c.receiver, c.sender)
		case <-r.closer:
			return
		default:
		}
		// クライアントからのメッセージを処理
		for userId, client := range r.clients {
			select {
			case m := <-client.receiver:
				switch m.Command {
				case CmdClientLeaveRoom:
					r.cancelSubscribe(userId)
					names := r.userNames()
					r.broadCast(&RoomMessage{
						Command: CmdRoomUsersInRoom,
						Content: names,
					})
				case CmdClientStartGame:
					return
				default:
				}
			default:
			}
		}
	}
}

func (r *Room) close() {
	for _, client := range r.clients {
		client.sender <- &RoomMessage{
			Command: CmdRoomClose,
			Content: nil,
		}
	}
	ra.deleteRoom(r.id)
}

// 部屋にクライアントを登録する
// r.Run GoRoutine内で呼ぶべし
func (r *Room) subscribe(
	id UserID,
	name string,
	receiver <-chan *ClientMessage,
	sender chan<- *RoomMessage,
) {
	client := roomClient{
		name:     name,
		receiver: receiver,
		sender:   sender,
	}
	r.clients[id] = client
	names := r.userNames()
	r.broadCast(&RoomMessage{
		Command: CmdRoomUsersInRoom,
		Content: names,
	})
}

func (r *Room) cancelSubscribe(id UserID) {
	delete(r.clients, id)
}

func (r *Room) broadCast(m *RoomMessage) {
	for _, client := range r.clients {
		client.sender <- m
	}
}

func (r *Room) userNames() RoomUsers {
	names := make([]string, 0, len(r.clients))
	for _, client := range r.clients {
		names = append(names, client.name)
	}
	return names
}
