# Poison Cookies
[heading__top]:
  #toxic-cookies
  "&#x2B06; Tool for poisoning browser cookies of currently loaded domain"


Tool for poisoning browser cookies of currently loaded domain


## [![Byte size of Poison Cookies][badge__main__toxic_cookies__source_code]][toxic_cookies__main__source_code] [![Open Issues][badge__issues__toxic_cookies]][issues__toxic_cookies] [![Open Pull Requests][badge__pull_requests__toxic_cookies]][pull_requests__toxic_cookies] [![Latest commits][badge__commits__toxic_cookies__main]][commits__toxic_cookies__main] [![Build Status][badge_travis_ci]][build_travis_ci]


---


- [:arrow_up: Top of Document][heading__top]

- [:building_construction: Requirements][heading__requirements]

- [:zap: Quick Start][heading__quick_start]

  - [:memo: Edit Your ReadMe File][heading__your_readme_file]
  - [:floppy_disk: Commit and Push][heading__commit_and_push]

- [&#x1F9F0; Usage][heading__usage]

- [&#x1F5D2; Notes][heading__notes]

- [:chart_with_upwards_trend: Contributing][heading__contributing]

  - [:trident: Forking][heading__forking]
  - [:currency_exchange: Sponsor][heading__sponsor]

- [:card_index: Attribution][heading__attribution]

- [:balance_scale: Licensing][heading__license]


---



## Requirements
[heading__requirements]:
  #requirements
  "&#x1F3D7; Prerequisites and/or dependencies that this project needs to function properly"


Use `npm` to install development dependencies...


```Bash
cd ~/git/hub/javascript-utilities/toxic-cookies

npm install
```


> Note, `npm` is **not** necessarily required to make use of this project.


______


## Quick Start
[heading__quick_start]:
  #quick-start
  "&#9889; Perhaps as easy as one, 2.0,..."


If using this project within GitHub Pages, or similar deployments, then it is encouraged the use of Git Submodules to track dependencies.


**Bash Variables**


```Bash
_module_name='toxic-cookies'
_module_https_url="https://github.com/javascript-utilities/toxic-cookies.git"
_module_base_dir='assets/javascript/modules'
_module_path="${_module_base_dir}/${_module_name}"
```


**Bash Submodule Commands**


```Bash
cd "<your-git-project-path>"

git checkout gh-pages
mkdir -vp "${_module_base_dir}"

git submodule add -b main\
                  --name "${_module_name}"\
                  "${_module_https_url}"\
                  "${_module_path}"
```


---


### Your ReadMe File
[heading__your_readme_file]:
  #your-readme-file
  "&#x1F4DD; Suggested additions for your ReadMe.md file so everyone has a good time with submodules"


Suggested additions for your _`ReadMe.md`_ file so everyone has a good time with submodules


```MarkDown
Clone with the following to avoid incomplete downloads


    git clone --recurse-submodules <url-for-your-project>


Update/upgrade submodules via


    git submodule update --init --merge --recursive
```


---


### Commit and Push
[heading__commit_and_push]:
  #commit-and-push
  "&#x1F4BE; It may be just this easy..."


```Bash
git add .gitmodules
git add "${_module_path}"


## Add any changed files too


git commit -F- <<'EOF'
:heavy_plus_sign: Adds `javascript-utilities/toxic-cookies#1` submodule



**Additions**


- `.gitmodules`, tracks submodules AKA Git within Git _fanciness_

- `README.md`, updates installation and updating guidance

- `_modules_/toxic-cookies`, Tool for poisoning browser cookies of currently loaded domain
EOF


git push origin gh-pages
```


**:tada: Excellent :tada:** your project is now ready to begin unitizing code from this repository!


______


## Usage
[heading__usage]:
  #usage
  "&#x1F9F0; How to utilize this repository"


**`index.html`**


```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Toxic Cookies Tests</title>
    <script src="assets/javascript/toxic-cookies/toxic-cookies.js" differ></script>
    <script src="assets/javascript/index.js" differ></script>
  </head>

  <body>
    <div id="container__inputs">
      <input type="button"
             id="button__poison_cookies"
             for="button__print_cookies"
             value="Poison Cookies">

      <input type="button"
             id="button__print_cookies"
             for="container__cookie_output"
             value="Print Cookies">

      <input type="button"
             id="button__empty_cookies"
             for="button__print_cookies"
             value="Empty Cookies">

      <input type="button"
             id="button__refresh"
             value="Refresh">
    </div>

    <div id="container__outputs">
      <pre id="container__cookie_output"></pre>
    </div>
  </body>
</html>
```


**`assets/javascript/index.js`**


```JavaScript
'use strict';


const toxic_cookies = new Toxic_Cookies({
  clean_keys: [ 'auth' ],
  max_bite_size: 4090,
  path: document.location.pathname,
  key_callback: () => { return Math.random(); },
  value_callback: () => { return Math.random(); },
});


window.addEventListener('load', () => {
  const button__poison_cookies = document.getElementById('button__poison_cookies');
  button__poison_cookies.addEventListener('click', (event) => {
    toxic_cookies.poisionAllCookies();

    const button__print_cookies__id = event.target.getAttribute('for');
    const button__print_cookies = document.getElementById(button__print_cookies__id);
    button__print_cookies.click();
  });

  const button__print_cookies = document.getElementById('button__print_cookies');
  button__print_cookies.addEventListener('click', (event) => {
    const objectified_cookies = toxic_cookies.constructor.objectifyCookies();
    const output_id = event.target.getAttribute('for');
    const container__cookie_output = document.getElementById(output_id);
    container__cookie_output.innerText = JSON.stringify(objectified_cookies, null, 2);
  });

  const button__empty_cookies = document.getElementById('button__empty_cookies');
  button__empty_cookies.addEventListener('click', (event) => {
    const experation = toxic_cookies.constructor.calculateCookieExpiration(-1);
    const cookie_metadata = `expires=${experation};path=${toxic_cookies.path}`;

    const objectified_cookies = toxic_cookies.constructor.objectifyCookies();
    Object.entries(objectified_cookies).forEach(([key, value]) => {
      if (!toxic_cookies.clean_keys.includes(key)) {
        window.document.cookie = `${key}=;${cookie_metadata}`;
      }
    });

    const button__print_cookies__id = event.target.getAttribute('for');
    const button__print_cookies = document.getElementById(button__print_cookies__id);
    button__print_cookies.click()
  });

  const button__refresh = document.getElementById('button__refresh');
  button__refresh.addEventListener('click', (_event) => {
    window.location.reload(false);
    return false;
  });

  button__print_cookies.click();
});
```


> Monitor your server/service logs if available.


______


## Notes
[heading__notes]:
  #notes
  "&#x1F5D2; Additional things to keep in mind when developing"


This project is intended for testing serves(es) and/or domain(s) that permit [fuzzing](https://en.wikipedia.org/wiki/Fuzzing) tools; ie. check bug bounty rules for a given domain prior to utilizing this tool.


This repository may not be feature complete and/or fully functional, Pull Requests that add features or fix bugs are certainly welcomed.


______


## Contributing
[heading__contributing]:
  #contributing
  "&#x1F4C8; Options for contributing to toxic-cookies and javascript-utilities"


Options for contributing to toxic-cookies and javascript-utilities


---


### Forking
[heading__forking]:
  #forking
  "&#x1F531; Tips for forking toxic-cookies"


Start making a [Fork][toxic_cookies__fork_it] of this repository to an account that you have write permissions for.


- Add remote for fork URL. The URL syntax is _`git@github.com:<NAME>/<REPO>.git`_...


```Bash
cd ~/git/hub/javascript-utilities/toxic-cookies

git remote add fork git@github.com:<NAME>/toxic-cookies.git
```


- Commit your changes and push to your fork, eg. to fix an issue...


```Bash
cd ~/git/hub/javascript-utilities/toxic-cookies


git commit -F- <<'EOF'
:bug: Fixes #42 Issue


**Edits**


- `<SCRIPT-NAME>` script, fixes some bug reported in issue
EOF


git push fork main
```


> Note, the `-u` option may be used to set `fork` as the default remote, eg. _`git push fork main`_ however, this will also default the `fork` remote for pulling from too! Meaning that pulling updates from `origin` must be done explicitly, eg. _`git pull origin main`_


- Then on GitHub submit a Pull Request through the Web-UI, the URL syntax is _`https://github.com/<NAME>/<REPO>/pull/new/<BRANCH>`_


> Note; to decrease the chances of your Pull Request needing modifications before being accepted, please check the [dot-github](https://github.com/javascript-utilities/.github) repository for detailed contributing guidelines.


---


### Sponsor
  [heading__sponsor]:
  #sponsor
  "&#x1F4B1; Methods for financially supporting javascript-utilities that maintains toxic-cookies"


Thanks for even considering it!


With [![sponsor__shields_io__liberapay]][sponsor__link__liberapay] you may sponsor javascript-utilities on a repeating basis.


Regardless of if you're able to financially support projects such as toxic-cookies that javascript-utilities maintains, please consider sharing projects that are useful with others, because one of the goals of maintaining Open Source repositories is to provide value to the community.


______


## Attribution
[heading__attribution]:
  #attribution
  "&#x1F4C7; Resources that where helpful in building this project so far."


- [GitHub -- `github-utilities/make-readme`](https://github.com/github-utilities/make-readme)

- [StackOverflow -- How can I list all cookies for the current page with JavaScript](https://stackoverflow.com/questions/3400759)

- [StackOverflow -- What is the maximum size of a web browsers cookies key](https://stackoverflow.com/questions/640938/)

- [StackOverflow -- How to mock cookie `getLanguage` in Jest](https://stackoverflow.com/questions/50761393/)

- [StackOverflow -- How to reload a page using JavaScript](https://stackoverflow.com/questions/3715047/)


______


## License
[heading__license]:
  #license
  "&#x2696; Legal side of Open Source"


```
Tool for poisoning browser cookies of currently loaded domain
Copyright (C) 2020 S0AndS0

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```


For further details review full length version of [AGPL-3.0][branch__current__license] License.



[branch__current__license]:
  /LICENSE
  "&#x2696; Full length version of AGPL-3.0 License"


[badge__commits__toxic_cookies__main]:
  https://img.shields.io/github/last-commit/javascript-utilities/toxic-cookies/main.svg

[commits__toxic_cookies__main]:
  https://github.com/javascript-utilities/toxic-cookies/commits/main
  "&#x1F4DD; History of changes on this branch"


[toxic_cookies__community]:
  https://github.com/javascript-utilities/toxic-cookies/community
  "&#x1F331; Dedicated to functioning code"

[toxic_cookies__gh_pages]:
  https://github.com/javascript-utilities/toxic-cookies/tree/
  "Source code examples hosted thanks to GitHub Pages!"

[badge__gh_pages__toxic_cookies]:
  https://img.shields.io/website/https/javascript-utilities.github.io/toxic-cookies/index.html.svg?down_color=darkorange&down_message=Offline&label=Demo&logo=Demo%20Site&up_color=success&up_message=Online

[gh_pages__toxic_cookies]:
  https://javascript-utilities.github.io/toxic-cookies/index.html
  "&#x1F52C; Check the example collection tests"

[issues__toxic_cookies]:
  https://github.com/javascript-utilities/toxic-cookies/issues
  "&#x2622; Search for and _bump_ existing issues or open new issues for project maintainer to address."

[toxic_cookies__fork_it]:
  https://github.com/javascript-utilities/toxic-cookies/
  "&#x1F531; Fork it!"

[pull_requests__toxic_cookies]:
  https://github.com/javascript-utilities/toxic-cookies/pulls
  "&#x1F3D7; Pull Request friendly, though please check the Community guidelines"

[toxic_cookies__main__source_code]:
  https://github.com/javascript-utilities/toxic-cookies/
  "&#x2328; Project source!"

[badge__issues__toxic_cookies]:
  https://img.shields.io/github/issues/javascript-utilities/toxic-cookies.svg

[badge__pull_requests__toxic_cookies]:
  https://img.shields.io/github/issues-pr/javascript-utilities/toxic-cookies.svg

[badge__main__toxic_cookies__source_code]:
  https://img.shields.io/github/repo-size/javascript-utilities/toxic-cookies


[badge_travis_ci]:
  https://travis-ci.com/javascript-utilities/toxic-cookies.svg?branch=main

[build_travis_ci]:
  https://travis-ci.com/javascript-utilities/toxic-cookies


[sponsor__shields_io__liberapay]:
  https://img.shields.io/static/v1?logo=liberapay&label=Sponsor&message=javascript-utilities

[sponsor__link__liberapay]:
  https://liberapay.com/javascript-utilities
  "&#x1F4B1; Sponsor developments and projects that javascript-utilities maintains via Liberapay"

