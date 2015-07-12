/**
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 * <p/>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p/>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p/>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.opencloudengine.flamingo2.web.configuration;

import org.opencloudengine.flamingo2.core.rest.Response;
import org.opencloudengine.flamingo2.util.JsonUtils;
import org.opencloudengine.flamingo2.util.Messages;
import org.opencloudengine.flamingo2.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

import static org.apache.commons.lang.StringUtils.isEmpty;
import static org.apache.commons.lang.StringUtils.splitPreserveAllTokens;

/**
 * 애플리케이션 설정 파일(<tt>config.properties</tt>)을 JavaScript에서 사용하기 위해서 JSON으로 변환하는 컨트롤러.
 *
 * @author Byoung Gon, Kim
 * @since 2.0
 */
@RestController
@RequestMapping("/config")
public class ConfigurationController implements InitializingBean {

    /**
     * SLF4J Logging
     */
    private Logger logger = LoggerFactory.getLogger(ConfigurationController.class);

    /**
     * JavaScript Variable Prefix
     */
    private final static String JS_PREFIX = "var config = ";

    /**
     * JavaScript End Postfix
     */
    private final static String JS_POSTFIX = ";";

    /**
     * JavaScript Content Type
     */
    private final static String CONTENT_TYPE = "application/x-javascript; charset=UTF-8";

    @Autowired
    @Qualifier("config")
    private Properties config;

    @Autowired
    @Qualifier("app")
    private Properties app;

    /**
     * Configuration JSON
     */
    private String configJson;

    /**
     * 환경설정 파일에서 expose. 로 시작하는 환경설정값을 JavaScript에서 사용할 수 있는 포맷으로 변경한다.
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        Map params = new HashMap();
        Set<Object> configKeys = config.keySet();
        for (Object key : configKeys) {
            String value = (String) config.get(key);
            // 웹 클라이언트에 노출할 Key를 찾아서 이를 처리한다.
            if (((String) key).equals("web.expose.keys")) {
                String keysToExport = config.getProperty("web.expose.keys");
                String[] keyToExport = splitPreserveAllTokens(keysToExport, ",");
                for (String string : keyToExport) {
                    if (!isEmpty(System.getProperty(string.trim()))) {
                        params.put(string.trim(), System.getProperty(string.trim()));
                    } else {
                        if (isEmpty(config.getProperty(string.trim()))) {
                            params.put(string.trim(), "");
                        } else {
                            params.put(string.trim(), config.getProperty(string.trim()).trim());
                        }
                    }
                }
            } else {
                // web. 로 시작하는 모든 Key를 찾아서 웹에 노출한다.
                if (((String) key).startsWith("web.")) {
                    String removed = StringUtils.replace(((String) key), "web.", "");
                    if (!isEmpty(System.getProperty(removed))) {
                        params.put(removed.trim(), System.getProperty(removed));
                    } else {
                        params.put(removed.trim(), value.trim());
                    }
                }
            }
        }

        Set<Object> appKeys = app.keySet();
        for (Object key : appKeys) {
            String value = (String) app.get(key);
            params.put(key, value.trim());
        }

        configJson = JsonUtils.format(params);
    }

    /**
     * 환경설정 파일을 웹 브라우저에서 사용하기 위해서 JavaScript로 변환한다.
     */
    @RequestMapping(value = "js", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> getConfiguration(final HttpServletRequest request, final HttpServletResponse response, final Locale locale) throws IOException {
        MultiValueMap headers = new HttpHeaders();
        headers.set("Content-Type", CONTENT_TYPE);
        return new ResponseEntity(JS_PREFIX + configJson + JS_POSTFIX, headers, HttpStatus.OK);
    }

    /**
     * 다국어 지원을 위한 리소스 번들을 처리한다.
     */
    @RequestMapping(value = "bundle", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> getBundle(final HttpServletRequest request, final HttpServletResponse response, final Locale locale) throws IOException {
        Map map = Messages.toMap(locale);
        map.put("browser.language", locale.getLanguage());
        map.put("browser.country", locale.getCountry());
        map.put("browser.locale", locale.toString());

        MultiValueMap headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        return new ResponseEntity(JsonUtils.format(map), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "engines", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response getEngines() throws IOException {
        Response response = new Response();
        response.setSuccess(true);
        response.getList().addAll(ConfigurationHolder.getEngines().values());
        return response;
    }

}