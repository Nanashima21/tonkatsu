package session

import (
	"fmt"
	"os"
	"sync"
	"time"
	. "tonkatsu-server/internal/model"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// SessionTable はセッションIDをキーとしてセッション情報を値とするmap.
// セッションIDはUUID.
type sessionTable map[string]sessionInfo

var (
	s     = sessionTable{}
	slock sync.RWMutex
)

const (
	sAgeSec = 3600
	// gin.Contextにユーザを保存する際のキー
	skey = "toknkatsuUserIDKey"
	// セッションのCookieのname属性
	sCookieName = "tonkatsu-session"
)

// CreateSession はユーザIDをもとにセッションのためのCookieを生成する.
func CreateSesison(ctx *gin.Context, id UserID) error {
	sUUID, err := uuid.NewRandom()
	if err != nil {
		return err
	}
	sid := sUUID.String()
	now := time.Now()
	slock.Lock()
	s[sid] = sessionInfo{accessed_at: now, userID: id}
	slock.Unlock()
	ctx.SetCookie(sCookieName, sid, sAgeSec, "/", "", false, true)
	return nil
}

// ConfirmSession は, Cookieを見てセッションが確立しているかを確認する.
// `ctx`に`userID`を保存する.
func ConfirmSession(ctx *gin.Context) bool {
	sid, err := ctx.Cookie(sCookieName)
	if err != nil {
		return false
	}

	slock.RLock()
	sinfo, ok := s[sid]
	slock.RUnlock()
	if !ok {
		return false
	}

	ctx.Set(skey, sinfo.userID)

	return true
}

// ユーザIDを取得する
// ConfirmSessionした後に用いる
func GetUserId(ctx *gin.Context) (UserID, bool) {
	id, ok := ctx.Get(skey)
	if !ok {
		return 0, false
	} else {
		return id.(UserID), true
	}
}

func UpdateSession(ctx *gin.Context) error {
	sessionID, err := ctx.Cookie(sCookieName)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return err
	}
	userID, ok := GetUserId(ctx)
	if !ok {
		// This must not occur
		fmt.Fprintln(os.Stderr, "Cannot get user id in updating session")
		return fmt.Errorf("Cannot get user id")
	}
	slock.Lock()
	s[sessionID] = sessionInfo{time.Now(), userID}
	slock.Unlock()
	ctx.SetCookie(sCookieName, sessionID, sAgeSec, "/", "", false, true)
	return nil
}

func BreakSession(ctx *gin.Context) error {
	sessionId, err := ctx.Cookie(sCookieName)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return err
	}
	_, ok := GetUserId(ctx)
	if !ok {
		return fmt.Errorf("Cannot get user id")
	}
	slock.Lock()
	delete(s, sessionId)
	slock.Unlock()
	return nil
}
