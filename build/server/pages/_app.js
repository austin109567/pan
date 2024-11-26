"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/lib/apollo.ts":
/*!***************************!*\
  !*** ./src/lib/apollo.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   apolloClient: () => (/* binding */ apolloClient)\n/* harmony export */ });\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @apollo/client/link/context */ \"@apollo/client/link/context\");\n/* harmony import */ var _apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./supabase */ \"./src/lib/supabase.ts\");\n\n\n\nconst httpLink = (0,_apollo_client__WEBPACK_IMPORTED_MODULE_0__.createHttpLink)({\n    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL\n});\nconst authLink = (0,_apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1__.setContext)(async (_, { headers })=>{\n    const { data: { session } } = await _supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.getSession();\n    return {\n        headers: {\n            ...headers,\n            authorization: session?.access_token ? `Bearer ${session.access_token}` : \"\"\n        }\n    };\n});\nconst apolloClient = new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloClient({\n    link: authLink.concat(httpLink),\n    cache: new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.InMemoryCache(),\n    defaultOptions: {\n        watchQuery: {\n            fetchPolicy: \"cache-and-network\"\n        }\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL2Fwb2xsby50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBNkU7QUFDcEI7QUFDbkI7QUFFdEMsTUFBTUssV0FBV0gsOERBQWNBLENBQUM7SUFDOUJJLEtBQUtDLFFBQVFDLEdBQUcsQ0FBQ0MsdUJBQXVCO0FBQzFDO0FBRUEsTUFBTUMsV0FBV1AsdUVBQVVBLENBQUMsT0FBT1EsR0FBRyxFQUFFQyxPQUFPLEVBQUU7SUFDL0MsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLE9BQU8sRUFBRSxFQUFFLEdBQUcsTUFBTVYsK0NBQVFBLENBQUNXLElBQUksQ0FBQ0MsVUFBVTtJQUU1RCxPQUFPO1FBQ0xKLFNBQVM7WUFDUCxHQUFHQSxPQUFPO1lBQ1ZLLGVBQWVILFNBQVNJLGVBQWUsQ0FBQyxPQUFPLEVBQUVKLFFBQVFJLFlBQVksQ0FBQyxDQUFDLEdBQUc7UUFDNUU7SUFDRjtBQUNGO0FBRU8sTUFBTUMsZUFBZSxJQUFJbkIsd0RBQVlBLENBQUM7SUFDM0NvQixNQUFNVixTQUFTVyxNQUFNLENBQUNoQjtJQUN0QmlCLE9BQU8sSUFBSXJCLHlEQUFhQTtJQUN4QnNCLGdCQUFnQjtRQUNkQyxZQUFZO1lBQ1ZDLGFBQWE7UUFDZjtJQUNGO0FBQ0YsR0FBRyIsInNvdXJjZXMiOlsid2VicGFjazovL3JhaWRyYWxseS8uL3NyYy9saWIvYXBvbGxvLnRzPzljMjQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBvbGxvQ2xpZW50LCBJbk1lbW9yeUNhY2hlLCBjcmVhdGVIdHRwTGluayB9IGZyb20gJ0BhcG9sbG8vY2xpZW50JztcbmltcG9ydCB7IHNldENvbnRleHQgfSBmcm9tICdAYXBvbGxvL2NsaWVudC9saW5rL2NvbnRleHQnO1xuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tICcuL3N1cGFiYXNlJztcblxuY29uc3QgaHR0cExpbmsgPSBjcmVhdGVIdHRwTGluayh7XG4gIHVyaTogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfR1JBUEhRTF9VUkwsXG59KTtcblxuY29uc3QgYXV0aExpbmsgPSBzZXRDb250ZXh0KGFzeW5jIChfLCB7IGhlYWRlcnMgfSkgPT4ge1xuICBjb25zdCB7IGRhdGE6IHsgc2Vzc2lvbiB9IH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFNlc3Npb24oKTtcbiAgXG4gIHJldHVybiB7XG4gICAgaGVhZGVyczoge1xuICAgICAgLi4uaGVhZGVycyxcbiAgICAgIGF1dGhvcml6YXRpb246IHNlc3Npb24/LmFjY2Vzc190b2tlbiA/IGBCZWFyZXIgJHtzZXNzaW9uLmFjY2Vzc190b2tlbn1gIDogJycsXG4gICAgfSxcbiAgfTtcbn0pO1xuXG5leHBvcnQgY29uc3QgYXBvbGxvQ2xpZW50ID0gbmV3IEFwb2xsb0NsaWVudCh7XG4gIGxpbms6IGF1dGhMaW5rLmNvbmNhdChodHRwTGluayksXG4gIGNhY2hlOiBuZXcgSW5NZW1vcnlDYWNoZSgpLFxuICBkZWZhdWx0T3B0aW9uczoge1xuICAgIHdhdGNoUXVlcnk6IHtcbiAgICAgIGZldGNoUG9saWN5OiAnY2FjaGUtYW5kLW5ldHdvcmsnLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLCJuYW1lcyI6WyJBcG9sbG9DbGllbnQiLCJJbk1lbW9yeUNhY2hlIiwiY3JlYXRlSHR0cExpbmsiLCJzZXRDb250ZXh0Iiwic3VwYWJhc2UiLCJodHRwTGluayIsInVyaSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19HUkFQSFFMX1VSTCIsImF1dGhMaW5rIiwiXyIsImhlYWRlcnMiLCJkYXRhIiwic2Vzc2lvbiIsImF1dGgiLCJnZXRTZXNzaW9uIiwiYXV0aG9yaXphdGlvbiIsImFjY2Vzc190b2tlbiIsImFwb2xsb0NsaWVudCIsImxpbmsiLCJjb25jYXQiLCJjYWNoZSIsImRlZmF1bHRPcHRpb25zIiwid2F0Y2hRdWVyeSIsImZldGNoUG9saWN5Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/lib/apollo.ts\n");

/***/ }),

/***/ "./src/lib/supabase.ts":
/*!*****************************!*\
  !*** ./src/lib/supabase.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getUser: () => (/* binding */ getUser),\n/* harmony export */   signOut: () => (/* binding */ signOut),\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n\nconst supabaseUrl = \"https://ddfkrydlvzkmhxixhdeu.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZmtyeWRsdnprbWh4aXhoZGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3OTI0MDQsImV4cCI6MjA0NzM2ODQwNH0.PgN7BXHMc97Ih18MZUKL37iSe8nlwwDdpteC7WzKNzU\";\nif (!supabaseUrl || !supabaseAnonKey) {\n    throw new Error(\"Missing Supabase environment variables\");\n}\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\nconst getUser = async ()=>{\n    const { data: { user } } = await supabase.auth.getUser();\n    return user;\n};\nconst signOut = async ()=>{\n    const { error } = await supabase.auth.signOut();\n    if (error) throw error;\n}; // Add more Supabase utility functions as needed\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL3N1cGFiYXNlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXFEO0FBRXJELE1BQU1DLGNBQWNDLDBDQUFvQztBQUN4RCxNQUFNRyxrQkFBa0JILGtOQUF5QztBQUVqRSxJQUFJLENBQUNELGVBQWUsQ0FBQ0ksaUJBQWlCO0lBQ3BDLE1BQU0sSUFBSUUsTUFBTTtBQUNsQjtBQUVPLE1BQU1DLFdBQVdSLG1FQUFZQSxDQUFDQyxhQUFhSSxpQkFBaUI7QUFFNUQsTUFBTUksVUFBVTtJQUNyQixNQUFNLEVBQUVDLE1BQU0sRUFBRUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxNQUFNSCxTQUFTSSxJQUFJLENBQUNILE9BQU87SUFDdEQsT0FBT0U7QUFDVCxFQUFFO0FBRUssTUFBTUUsVUFBVTtJQUNyQixNQUFNLEVBQUVDLEtBQUssRUFBRSxHQUFHLE1BQU1OLFNBQVNJLElBQUksQ0FBQ0MsT0FBTztJQUM3QyxJQUFJQyxPQUFPLE1BQU1BO0FBQ25CLEVBQUUsQ0FFRixnREFBZ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYWlkcmFsbHkvLi9zcmMvbGliL3N1cGFiYXNlLnRzPzA2ZTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcblxuY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkw7XG5jb25zdCBzdXBhYmFzZUFub25LZXkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWTtcblxuaWYgKCFzdXBhYmFzZVVybCB8fCAhc3VwYWJhc2VBbm9uS2V5KSB7XG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBTdXBhYmFzZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMnKTtcbn1cblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZUFub25LZXkpO1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlciA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgeyBkYXRhOiB7IHVzZXIgfSB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKCk7XG4gIHJldHVybiB1c2VyO1xufTtcblxuZXhwb3J0IGNvbnN0IHNpZ25PdXQgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguc2lnbk91dCgpO1xuICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xufTtcblxuLy8gQWRkIG1vcmUgU3VwYWJhc2UgdXRpbGl0eSBmdW5jdGlvbnMgYXMgbmVlZGVkXG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50Iiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VBbm9uS2V5IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkiLCJFcnJvciIsInN1cGFiYXNlIiwiZ2V0VXNlciIsImRhdGEiLCJ1c2VyIiwiYXV0aCIsInNpZ25PdXQiLCJlcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/lib/supabase.ts\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/wallet-adapter-base */ \"@solana/wallet-adapter-base\");\n/* harmony import */ var _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @solana/wallet-adapter-react */ \"@solana/wallet-adapter-react\");\n/* harmony import */ var _solana_wallet_adapter_phantom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @solana/wallet-adapter-phantom */ \"@solana/wallet-adapter-phantom\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @solana/web3.js */ \"@solana/web3.js\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _lib_apollo__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/apollo */ \"./src/lib/apollo.ts\");\n/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../theme */ \"./src/theme.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__, _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_4__, _solana_wallet_adapter_phantom__WEBPACK_IMPORTED_MODULE_5__, _theme__WEBPACK_IMPORTED_MODULE_9__]);\n([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__, _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_4__, _solana_wallet_adapter_phantom__WEBPACK_IMPORTED_MODULE_5__, _theme__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\n\nconst App = ({ Component, pageProps })=>{\n    const network = _solana_wallet_adapter_base__WEBPACK_IMPORTED_MODULE_3__.WalletAdapterNetwork.Devnet;\n    const endpoint = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(()=>(0,_solana_web3_js__WEBPACK_IMPORTED_MODULE_6__.clusterApiUrl)(network), [\n        network\n    ]);\n    const wallets = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(()=>[\n            new _solana_wallet_adapter_phantom__WEBPACK_IMPORTED_MODULE_5__.PhantomWalletAdapter()\n        ], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ChakraProvider, {\n        theme: _theme__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_apollo_client__WEBPACK_IMPORTED_MODULE_2__.ApolloProvider, {\n            client: _lib_apollo__WEBPACK_IMPORTED_MODULE_8__.apolloClient,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_4__.ConnectionProvider, {\n                endpoint: endpoint,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_4__.WalletProvider, {\n                    wallets: wallets,\n                    autoConnect: true,\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                        ...pageProps\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\austi\\\\Desktop\\\\Website\\\\RaidRallyNew\\\\src\\\\pages\\\\_app.tsx\",\n                        lineNumber: 25,\n                        columnNumber: 13\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\austi\\\\Desktop\\\\Website\\\\RaidRallyNew\\\\src\\\\pages\\\\_app.tsx\",\n                    lineNumber: 24,\n                    columnNumber: 11\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\austi\\\\Desktop\\\\Website\\\\RaidRallyNew\\\\src\\\\pages\\\\_app.tsx\",\n                lineNumber: 23,\n                columnNumber: 9\n            }, undefined)\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\austi\\\\Desktop\\\\Website\\\\RaidRallyNew\\\\src\\\\pages\\\\_app.tsx\",\n            lineNumber: 22,\n            columnNumber: 7\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\austi\\\\Desktop\\\\Website\\\\RaidRallyNew\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 21,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFrRDtBQUNGO0FBQ21CO0FBSTdCO0FBQ2dDO0FBQ3RCO0FBRVo7QUFDUztBQUNoQjtBQUU3QixNQUFNVSxNQUFvQixDQUFDLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ2pELE1BQU1DLFVBQVVYLDZFQUFvQkEsQ0FBQ1ksTUFBTTtJQUMzQyxNQUFNQyxXQUFXUiw4Q0FBT0EsQ0FBQyxJQUFNRCw4REFBYUEsQ0FBQ08sVUFBVTtRQUFDQTtLQUFRO0lBQ2hFLE1BQU1HLFVBQVVULDhDQUFPQSxDQUFDLElBQU07WUFBQyxJQUFJRixnRkFBb0JBO1NBQUcsRUFBRSxFQUFFO0lBRTlELHFCQUNFLDhEQUFDTCw0REFBY0E7UUFBQ1MsT0FBT0EsOENBQUtBO2tCQUMxQiw0RUFBQ1IsMERBQWNBO1lBQUNnQixRQUFRVCxxREFBWUE7c0JBQ2xDLDRFQUFDTCw0RUFBa0JBO2dCQUFDWSxVQUFVQTswQkFDNUIsNEVBQUNYLHdFQUFjQTtvQkFBQ1ksU0FBU0E7b0JBQVNFLFdBQVc7OEJBQzNDLDRFQUFDUDt3QkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1wQztBQUVBLGlFQUFlRixHQUFHQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFpZHJhbGx5Ly4vc3JjL3BhZ2VzL19hcHAudHN4P2Y5ZDYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hha3JhUHJvdmlkZXIgfSBmcm9tICdAY2hha3JhLXVpL3JlYWN0JztcbmltcG9ydCB7IEFwb2xsb1Byb3ZpZGVyIH0gZnJvbSAnQGFwb2xsby9jbGllbnQnO1xuaW1wb3J0IHsgV2FsbGV0QWRhcHRlck5ldHdvcmsgfSBmcm9tICdAc29sYW5hL3dhbGxldC1hZGFwdGVyLWJhc2UnO1xuaW1wb3J0IHtcbiAgQ29ubmVjdGlvblByb3ZpZGVyLFxuICBXYWxsZXRQcm92aWRlcixcbn0gZnJvbSAnQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdCc7XG5pbXBvcnQgeyBQaGFudG9tV2FsbGV0QWRhcHRlciB9IGZyb20gJ0Bzb2xhbmEvd2FsbGV0LWFkYXB0ZXItcGhhbnRvbSc7XG5pbXBvcnQgeyBjbHVzdGVyQXBpVXJsIH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xuaW1wb3J0IHsgRkMsIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBhcG9sbG9DbGllbnQgfSBmcm9tICcuLi9saWIvYXBvbGxvJztcbmltcG9ydCB0aGVtZSBmcm9tICcuLi90aGVtZSc7XG5cbmNvbnN0IEFwcDogRkM8QXBwUHJvcHM+ID0gKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkgPT4ge1xuICBjb25zdCBuZXR3b3JrID0gV2FsbGV0QWRhcHRlck5ldHdvcmsuRGV2bmV0O1xuICBjb25zdCBlbmRwb2ludCA9IHVzZU1lbW8oKCkgPT4gY2x1c3RlckFwaVVybChuZXR3b3JrKSwgW25ldHdvcmtdKTtcbiAgY29uc3Qgd2FsbGV0cyA9IHVzZU1lbW8oKCkgPT4gW25ldyBQaGFudG9tV2FsbGV0QWRhcHRlcigpXSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPENoYWtyYVByb3ZpZGVyIHRoZW1lPXt0aGVtZX0+XG4gICAgICA8QXBvbGxvUHJvdmlkZXIgY2xpZW50PXthcG9sbG9DbGllbnR9PlxuICAgICAgICA8Q29ubmVjdGlvblByb3ZpZGVyIGVuZHBvaW50PXtlbmRwb2ludH0+XG4gICAgICAgICAgPFdhbGxldFByb3ZpZGVyIHdhbGxldHM9e3dhbGxldHN9IGF1dG9Db25uZWN0PlxuICAgICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgICAgIDwvV2FsbGV0UHJvdmlkZXI+XG4gICAgICAgIDwvQ29ubmVjdGlvblByb3ZpZGVyPlxuICAgICAgPC9BcG9sbG9Qcm92aWRlcj5cbiAgICA8L0NoYWtyYVByb3ZpZGVyPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIl0sIm5hbWVzIjpbIkNoYWtyYVByb3ZpZGVyIiwiQXBvbGxvUHJvdmlkZXIiLCJXYWxsZXRBZGFwdGVyTmV0d29yayIsIkNvbm5lY3Rpb25Qcm92aWRlciIsIldhbGxldFByb3ZpZGVyIiwiUGhhbnRvbVdhbGxldEFkYXB0ZXIiLCJjbHVzdGVyQXBpVXJsIiwidXNlTWVtbyIsImFwb2xsb0NsaWVudCIsInRoZW1lIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwibmV0d29yayIsIkRldm5ldCIsImVuZHBvaW50Iiwid2FsbGV0cyIsImNsaWVudCIsImF1dG9Db25uZWN0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/theme.ts":
/*!**********************!*\
  !*** ./src/theme.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__]);\n_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst theme = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.extendTheme)({\n    config: {\n        initialColorMode: \"dark\",\n        useSystemColorMode: true\n    },\n    colors: {\n        brand: {\n            50: \"#f0f9ff\",\n            100: \"#e0f2fe\",\n            200: \"#bae6fd\",\n            300: \"#7dd3fc\",\n            400: \"#38bdf8\",\n            500: \"#0ea5e9\",\n            600: \"#0284c7\",\n            700: \"#0369a1\",\n            800: \"#075985\",\n            900: \"#0c4a6e\"\n        }\n    },\n    components: {\n        Button: {\n            defaultProps: {\n                colorScheme: \"brand\"\n            }\n        }\n    },\n    styles: {\n        global: {\n            body: {\n                bg: \"gray.900\",\n                color: \"white\"\n            }\n        }\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (theme);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdGhlbWUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBK0M7QUFFL0MsTUFBTUMsUUFBUUQsNkRBQVdBLENBQUM7SUFDeEJFLFFBQVE7UUFDTkMsa0JBQWtCO1FBQ2xCQyxvQkFBb0I7SUFDdEI7SUFDQUMsUUFBUTtRQUNOQyxPQUFPO1lBQ0wsSUFBSTtZQUNKLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztRQUNQO0lBQ0Y7SUFDQUMsWUFBWTtRQUNWQyxRQUFRO1lBQ05DLGNBQWM7Z0JBQ1pDLGFBQWE7WUFDZjtRQUNGO0lBQ0Y7SUFDQUMsUUFBUTtRQUNOQyxRQUFRO1lBQ05DLE1BQU07Z0JBQ0pDLElBQUk7Z0JBQ0pDLE9BQU87WUFDVDtRQUNGO0lBQ0Y7QUFDRjtBQUVBLGlFQUFlZCxLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFpZHJhbGx5Ly4vc3JjL3RoZW1lLnRzP2RjOWEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXh0ZW5kVGhlbWUgfSBmcm9tICdAY2hha3JhLXVpL3JlYWN0JztcblxuY29uc3QgdGhlbWUgPSBleHRlbmRUaGVtZSh7XG4gIGNvbmZpZzoge1xuICAgIGluaXRpYWxDb2xvck1vZGU6ICdkYXJrJyxcbiAgICB1c2VTeXN0ZW1Db2xvck1vZGU6IHRydWUsXG4gIH0sXG4gIGNvbG9yczoge1xuICAgIGJyYW5kOiB7XG4gICAgICA1MDogJyNmMGY5ZmYnLFxuICAgICAgMTAwOiAnI2UwZjJmZScsXG4gICAgICAyMDA6ICcjYmFlNmZkJyxcbiAgICAgIDMwMDogJyM3ZGQzZmMnLFxuICAgICAgNDAwOiAnIzM4YmRmOCcsXG4gICAgICA1MDA6ICcjMGVhNWU5JyxcbiAgICAgIDYwMDogJyMwMjg0YzcnLFxuICAgICAgNzAwOiAnIzAzNjlhMScsXG4gICAgICA4MDA6ICcjMDc1OTg1JyxcbiAgICAgIDkwMDogJyMwYzRhNmUnLFxuICAgIH0sXG4gIH0sXG4gIGNvbXBvbmVudHM6IHtcbiAgICBCdXR0b246IHtcbiAgICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICBjb2xvclNjaGVtZTogJ2JyYW5kJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgc3R5bGVzOiB7XG4gICAgZ2xvYmFsOiB7XG4gICAgICBib2R5OiB7XG4gICAgICAgIGJnOiAnZ3JheS45MDAnLFxuICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB0aGVtZTtcbiJdLCJuYW1lcyI6WyJleHRlbmRUaGVtZSIsInRoZW1lIiwiY29uZmlnIiwiaW5pdGlhbENvbG9yTW9kZSIsInVzZVN5c3RlbUNvbG9yTW9kZSIsImNvbG9ycyIsImJyYW5kIiwiY29tcG9uZW50cyIsIkJ1dHRvbiIsImRlZmF1bHRQcm9wcyIsImNvbG9yU2NoZW1lIiwic3R5bGVzIiwiZ2xvYmFsIiwiYm9keSIsImJnIiwiY29sb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/theme.ts\n");

/***/ }),

/***/ "@apollo/client":
/*!*********************************!*\
  !*** external "@apollo/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@apollo/client");

/***/ }),

/***/ "@apollo/client/link/context":
/*!**********************************************!*\
  !*** external "@apollo/client/link/context" ***!
  \**********************************************/
/***/ ((module) => {

module.exports = require("@apollo/client/link/context");

/***/ }),

/***/ "@solana/web3.js":
/*!**********************************!*\
  !*** external "@solana/web3.js" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@solana/web3.js");

/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@chakra-ui/react":
/*!***********************************!*\
  !*** external "@chakra-ui/react" ***!
  \***********************************/
/***/ ((module) => {

module.exports = import("@chakra-ui/react");;

/***/ }),

/***/ "@solana/wallet-adapter-base":
/*!**********************************************!*\
  !*** external "@solana/wallet-adapter-base" ***!
  \**********************************************/
/***/ ((module) => {

module.exports = import("@solana/wallet-adapter-base");;

/***/ }),

/***/ "@solana/wallet-adapter-phantom":
/*!*************************************************!*\
  !*** external "@solana/wallet-adapter-phantom" ***!
  \*************************************************/
/***/ ((module) => {

module.exports = import("@solana/wallet-adapter-phantom");;

/***/ }),

/***/ "@solana/wallet-adapter-react":
/*!***********************************************!*\
  !*** external "@solana/wallet-adapter-react" ***!
  \***********************************************/
/***/ ((module) => {

module.exports = import("@solana/wallet-adapter-react");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();