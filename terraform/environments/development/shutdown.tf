resource "azurerm_dev_test_global_vm_shutdown_schedule" "vm" {
  virtual_machine_id = azurerm_linux_virtual_machine.vm.id
  location           = azurerm_linux_virtual_machine.vm.location

  enabled               = true
  daily_recurrence_time = "2330"
  timezone              = "Sri Lanka Standard Time"

  notification_settings {
    enabled         = true
    time_in_minutes = 30
    email           = var.vm_shutdown_notification_email
  }

  tags = {
    app   = "deliveroo"
    env   = "develop"
    owner = "diludevx"
  }

  lifecycle {
    prevent_destroy = true
  }
}
