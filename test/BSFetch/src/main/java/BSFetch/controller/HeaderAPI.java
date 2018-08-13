package BSFetch.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HeaderAPI {
    @GetMapping ("/header/get")
    public ResponseEntity setHeader() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Message-From-Server", "this msg was sent from header of response");
        return new ResponseEntity(httpHeaders, HttpStatus.OK);
    }
    
    @GetMapping ("/header/read")
    public String readCookie(@RequestHeader ("Message-From-Client") String msg) {
        if (msg == null ||msg.isEmpty()) {
            return "not set";
        } else {
            return "received: " + msg;
        }
    }
}
