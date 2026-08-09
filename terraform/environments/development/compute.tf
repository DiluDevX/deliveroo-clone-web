resource "azurerm_linux_virtual_machine" "vm" {
  name                = "deliveroo-services-dev-vm"
  resource_group_name = azurerm_resource_group.platform.name
  location            = azurerm_resource_group.platform.location
  size                = "Standard_B2s_v2"
  admin_username      = "deliveroo"
  zone                = "2"

  network_interface_ids = [
    azurerm_network_interface.vm.id
  ]

  disable_password_authentication = true

  additional_capabilities {
    hibernation_enabled = false
    ultra_ssd_enabled   = false
  }

  secure_boot_enabled   = true
  vtpm_enabled          = true
  patch_mode            = "ImageDefault"
  patch_assessment_mode = "ImageDefault"

  admin_ssh_key {
    username   = "deliveroo"
    public_key = var.vm_admin_ssh_public_key
  }

  os_disk {
    name                 = "deliveroo-services-dev-vm_OsDisk_1_307d1ee15a214449b169c4596baefb43"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }

  identity {
    type = "SystemAssigned"
  }

  boot_diagnostics {}

  tags = {
    app   = "deliveroo"
    env   = "develop"
    owner = "diludevx"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "azurerm_ssh_public_key" "vm" {
  name                = "deliveroo-services-dev-vm_key"
  resource_group_name = azurerm_resource_group.platform.name
  location            = azurerm_resource_group.platform.location
  public_key          = var.vm_admin_ssh_public_key

  lifecycle {
    prevent_destroy = true
  }
}
