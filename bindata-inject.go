package playground

import (
	"encoding/json"
	"net/http"
	"os"
	"time"
)

var FS http.FileSystem = AssetFile

type endpointConfig struct {
	Endpoint             string `json:"endpoint"`
	SubscriptionEndpoint string `json:"subscriptionEndpoint"`
}

func SetEndpoints(endpoint, subscriptionEndpoint string) {
	config := endpointConfig{endpoint, subscriptionEndpoint}
	configData, _ := json.Marshal(config)
	_endpoint := func() (*asset, error) {
		info := bindataFileInfo{name: "_endpoint", size: int64(len(configData)), mode: os.FileMode(420), modTime: time.Now()}
		return &asset{bytes: configData, info: info}, nil
	}
	_bindata["_endpoint"] = _endpoint
	_bintree.Children["_endpoint"] = &bintree{_endpoint, map[string]*bintree{}}
}
