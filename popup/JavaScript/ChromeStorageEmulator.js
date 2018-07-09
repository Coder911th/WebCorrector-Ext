if (process.env.NODE_ENV == 'development') {
  var storage = {
    extension: true,
    version: 'v1.2.0 test',
    nextSecurityKey: 11,
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
      },
      {
        name: "~(O.o)~",
        sites: "Soluta maiores et molestiae fuga. Incidunt magni voluptas et sapiente et quis recusandae. Dolores error voluptate quas.",
        active: true,
        libs: [],
        code: "// Some code",
        securityKey: 3
      },
      {
        name: "Hello World",
        sites: "",
        active: true,
        libs: [],
        code: "// Some code",
        securityKey: 4
      },
      {
        name: "<i>italic</i>",
        sites: "<i>123</i>",
        active: true,
        libs: [],
        code: "// Some code",
        securityKey: 5
      },
      {
        name: "Coooooode",
        sites: "",
        active: true,
        libs: [],
        code: "// Some code",
        securityKey: 6
      },
      {
        name: "Super-Script",
        sites: "",
        active: true,
        libs: [],
        code: "// Some code",
        securityKey: 7
      },
      {
        name: "123",
        sites: "",
        active: true,
        libs: [],
        code: "// Some code",
        securityKey: 8
      },
      {
        name: "321",
        sites: "",
        active: true,
        libs: [],
        code: "// Some code",
        securityKey: 9
      },
      {
        name: "ooOOooOo",
        sites: "",
        active: true,
        libs: [],
        code: "// Some code",
        securityKey: 10
      }
    ],
    libs: [
      {
        alias: "jQuery 3.3.1",
        url: "https://code.jquery.com/jquery-3.3.1.js"
      },
      {
        alias: "Velocity",
        url: "https://cdnjs.cloudflare.com/ajax/libs/velocity/2.0.5/velocity.js"
      },
      {
        alias: "Lodash",
        url: "https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"
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