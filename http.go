package playground

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
	"time"
)

var WebBundle http.FileSystem = AssetFile()

func GetHandle(prefix string) http.Handler {
	return http.StripPrefix(prefix, http.FileServer(WebBundle))
}

type Playground interface {
	http.FileSystem
	http.Handler
}

type playground struct {
	assetFs   http.FileSystem
	handler   http.Handler
	_endpoint *assetFileWrapper
}

type assetFileWrapper struct {
	*assetFile
	info *bindataFileInfo
}

func (f *assetFileWrapper) Stat() (os.FileInfo, error) {
	if len(f.childInfos) != 0 {
		return newDirFileInfo(f.name), nil
	}
	return f.info, nil
}

func newAssetFileWrapper(name string, data interface{}) *assetFileWrapper {
	content, _ := json.Marshal(data)
	return &assetFileWrapper{
		assetFile: &assetFile{name: name, Reader: bytes.NewReader(content)},
		info:      &bindataFileInfo{name: name, size: int64(len(content)), mode: os.FileMode(420), modTime: time.Now()},
	}
}

func (p *playground) Open(name string) (http.File, error) {
	if name == "_endpoint" || name == "/_endpoint" {
		return p._endpoint, nil
	}
	return p.assetFs.Open(name)
}

func NewPlayground(pathPrefix, endpoint, wsEndpoint string) Playground {
	p := playground{}
	p._endpoint = newAssetFileWrapper("_endpoint", endpointConfig{
		Endpoint:             endpoint,
		SubscriptionEndpoint: wsEndpoint,
	})
	p.assetFs = AssetFile().(*assetOperator)
	p.handler = http.StripPrefix(pathPrefix, http.FileServer(&p))
	return &p
}

func (p *playground) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	p.handler.ServeHTTP(w, r)
}
