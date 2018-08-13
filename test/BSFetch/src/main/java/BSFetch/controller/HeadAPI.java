package BSFetch.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HeadAPI {
    @RequestMapping(value = "/head", method = RequestMethod.HEAD)
    public Map<String, Serializable> HEAD() {
        HashMap<String, Serializable> result = new HashMap<>();
        result.put("result", "success");
        return result;
    }
    
    @RequestMapping(value = "/head/msg", method = RequestMethod.HEAD)
    public void HEAD(String text) {
        System.out.println(text);
    }
}
