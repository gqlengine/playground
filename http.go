package playground

import (
	"net/http"
)

func GetHandle(prefix string) http.Handler {
	return http.StripPrefix(prefix, http.FileServer(WebBundle))
}
