import { createViewModel } from "./main-view-model";

const geolocation = require("@nativescript/geolocation");

export function onNavigatingTo(args) {
  const page = args.object;

  page.actionBarHidden = true;

  const vm = createViewModel();

  page.bindingContext = vm;

  geolocation
    .enableLocationRequest()
    .then(vm.onSync)
    .then(vm.onRefresh)
    .then(vm.onSend)
    .then(vm.watch);
}
