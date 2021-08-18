sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, Fragment, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("com.terraregia.Z_DEMOMIGUEL007.controller.Lista", {
		onInit: function () {
			var oViewModel = new JSONModel({
				Descripcion: "",
				Pais: "",
				Mode: "C",
				Title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titleCreacion"),
				TextoBoton: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("Crear")
			});
			this.getView().setModel(oViewModel, "viewModel");
		},
		onCabeceraPress: function (oEvent) {
			var oItem = oEvent.getParameter("listItem");
			var oObject = oItem.getBindingContext().getObject();
			this.getOwnerComponent().getRouter().navTo("RouteDetalle", {
				id: oObject.Id
			});
		},
		onCrear: function (oEvent) {
			var oView = this.getView();
			if (!this._oDialogCrear) {
				this._oDialogCrear = Fragment.load({
					id: oView.getId(),
					name: "com.terraregia.Z_DEMOMIGUEL007.view.DialogCrear",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._clearModel();
			this._oDialogCrear.then(function (oDialog) {
				oDialog.open();
			});
		},
		onCancelDialog: function (oEvent) {
			this._oDialogCrear.then(function (oDialog) {
				oDialog.close();
			});
		},
		onCrearCabecera: function (eEvenet) {
			var oViewModel = this.getView().getModel("viewModel");
			var sDescripcion = oViewModel.getProperty("/Descripcion");
			var sPais = oViewModel.getProperty("/Pais");

			//Llamado oData crear
			var oItem = {
				Descripcion: sDescripcion,
				Pais: sPais
			};
			this.getView().getModel().create("/CabeceraSet", oItem, {
				success: function (oData) {
					MessageBox.success("Registro Creado con ID: " + oData.Id);
				},
				error: function (oError) {
					MessageBox.error("Error al Insertar");
				}
			});

			this._oDialogCrear.then(function (oDialog) {
				oDialog.close();
			});
		},
		_clearModel: function () {
			var oViewModel = this.getView().getModel("viewModel");
			oViewModel.setProperty("/Descripcion", "");
			oViewModel.setProperty("/Pais", "");
		},
		onDeleteCabecera: function (oEvent) {
			var oItem = oEvent.getParameter("listItem");
			var oObject = oItem.getBindingContext().getObject();
			var sPath = "/CabeceraSet('" + oObject.Id + "')";
			MessageBox.confirm("Esta Seguro que desea eliminar el Registro" + oObject.Descripcion, {
				onClose: function (oAction) {
					if (oAction === "OK") {
						this.getView().getModel().remove(sPath, {
							success: function () {
								MessageBox.success("Registro eliminado con ID: " + oObject.Id);
							},
							error: function (oError) {
								MessageBox.error("Error al Borrar");
							}
						});
					}
				}.bind(this)
			});
		}
	});
});