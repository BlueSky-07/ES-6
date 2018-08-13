package BSFetch.controller;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
public class CookieAPI {
    @GetMapping ("/cookie/set")
    public String setCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("msg", "this cookie was set by header of response".replaceAll(" ", "%20"));
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);
        return "already set";
    }
    
    @GetMapping ("/cookie/read")
    public String readCookie(@CookieValue (value = "msg", defaultValue = "not set yet") String msg) {
        if (msg == null || msg.isEmpty()) {
            return "not set";
        } else {
            return "received: " + msg;
        }
    }
}
