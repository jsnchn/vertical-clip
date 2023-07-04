package db

import (
	"encoding/json"
	"github.com/rs/xid"
	"time"
)

type VideoStatus struct {
	Status	int
	Url		string
}

func (db *Database) InitVideoId() (string, error) {
	newId := xid.New().String()
	vs := VideoStatus{0,""}
	data, err := json.Marshal(&vs)
	if err != nil {
		panic(err)
	}
	err = db.Client.Set(Ctx, newId, data, 1 * time.Hour).Err()
	if err != nil {
		return "", err
	}
	return newId, nil
}

func (db *Database) UpdateVideoStatus(vs *VideoStatus, id string) error {
	data, err := json.Marshal(&vs)
	err = db.Client.Set(Ctx, id, data, 1 * time.Hour).Err()
	if err != nil {
		return err
	}
	return nil
}

func (db *Database) GetVideoStatus(id string) (*VideoStatus, error) {
	var vs VideoStatus
	data, err := db.Client.Get(Ctx, id).Result()
	err = json.Unmarshal([]byte(data), &vs)
	if err != nil {
		errVs := VideoStatus{-1,""}
		return &errVs, err
	}
	return &vs, nil
}

