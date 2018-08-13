package BSFetch.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class OptionsAPI {
    @RequestMapping (value = "/options", method = RequestMethod.OPTIONS)
    public ResponseEntity OPTIONS() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Allow", "OPTIONS");
        return new ResponseEntity(httpHeaders, HttpStatus.OK);
    }
}
