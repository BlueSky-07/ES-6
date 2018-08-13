package BSFetch.controller;

import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@RestController
public class GetAPI {
    @GetMapping ("/get/msg")
    public Map<String, Serializable> GET(String text) {
        HashMap<String, Serializable> result = new HashMap<>();
        if (text == null || text.isEmpty()) {
            result.put("status", "ERROR");
            result.put("result", "no valid message received!");
        } else {
            result.put("status", "SUCCESS");
            result.put("result", "received: " + text);
        }
        return result;
    }
}
