if (process.env.NODE_ENV == 'development') {
  var storage = {
    extension: true,
    version: 'v1.2.0 test',
    nextSecurityKey: 3,
    scripts: [
      {
        name: "Reloger",
        sites: "https://games.mail.ru/",
        active: true,
        libs: ["jQuery 3.3.1"],
        code: "$('.pm-logo__link').text('Relogo')",
        securityKey: 1
      },
      {
        name: "Alert",
        sites: "",
        active: true,
        libs: [],
        code: "alert('Hello world!')",
        securityKey: 2
      }
    ],
    libs: [
      {
        alias: "jQuery 3.3.1",
        url: "https://code.jquery.com/jquery-3.3.1.js"
      }
    ],
    lang: 'EN',	
    
    aboutScriptTarget: null,
    isOpenSpoiler: true,
    activeTab: 0,
    filterField: '',
    libAlias: '',
    libURL: '',
  
    scriptActive: true,
    scriptName: '',
    scriptSites: '',
    scriptLibs: [],
    scriptCode: '',
  
    filterFlags: {
      byName: true,
      bySite: false,
      bySecurityKey: false
    }
  };

  window.chrome = {
    runtime: {
      // Запрос на выполнение скрипта на странице
      sendMessage(message) {
        console.log('Выполнент запрос на выполнение скрипта на странице', message);
      },
      onMessage: {
        // Обработка изменения URL-адреса активной вкладки
        addListener(callback) {}
      }
    },
    storage: {
      local: {
        get(name, callback) {
          callback({[name]: storage[name]});
        },
        set(obj) {
          for (let key in obj) {
            storage[key] = obj[key];
          }
        }
      }
    },
    tabs: {
      // Запрос активной вклаки
      query(conf, callback) {
        console.log('Выполнен запрос активной вкладки');
        callback([{url: 'extension://example.com'}]);
      }
    }
  };
}