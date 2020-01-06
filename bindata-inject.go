package playground

import (
	"os"
	"time"
)

func InjectEndpoint(endpointPath string)  {
	_endpoint := func() (*asset, error) {
		info := bindataFileInfo{name: "_endpoint", size: int64(len(endpointPath)), mode: os.FileMode(420), modTime: time.Now()}
		return &asset{bytes: []byte(endpointPath), info: info}, nil
	}
	_bindata["_endpoint"] = _endpoint
	_bintree.Children["_endpoint"] = &bintree{_endpoint, map[string]*bintree{}}
}
