package playground

import (
	"bytes"
	"encoding/json"
	"net/http"
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
	epContent []byte
}

func (p *playground) Open(name string) (http.File, error) {
	if name == "_endpoint" || name == "/_endpoint" {
		return &assetFile{name: "_endpoint", Reader: bytes.NewReader(p.epContent)}, nil
	}
	return p.assetFs.Open(name)
}

func NewPlayground(pathPrefix, endpoint, wsEndpoint string) Playground {
	p := playground{}
	p.epContent, _ = json.Marshal(endpointConfig{
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
