import {
  to = azurerm_virtual_network.platform
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/virtualNetworks/deliveroo-services-dev-vnet"
}

import {
  to = azurerm_subnet.vm
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/virtualNetworks/deliveroo-services-dev-vnet/subnets/snet-southeastasia-1"
}

import {
  to = azurerm_network_security_group.vm
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/networkSecurityGroups/deliveroo-services-dev-vm-nsg"
}

import {
  to = azurerm_network_security_rule.http
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/networkSecurityGroups/deliveroo-services-dev-vm-nsg/securityRules/HTTP"
}

import {
  to = azurerm_network_security_rule.https
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/networkSecurityGroups/deliveroo-services-dev-vm-nsg/securityRules/HTTPS"
}

import {
  to = azurerm_network_security_rule.ssh
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/networkSecurityGroups/deliveroo-services-dev-vm-nsg/securityRules/SSH"
}

import {
  to = azurerm_public_ip.vm
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/publicIPAddresses/deliveroo-services-dev-vm-ip-f3acec4c"
}

import {
  to = azurerm_network_interface.vm
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/networkInterfaces/deliveroo-services-dev-vm716-f3acec4c"
}

import {
  to = azurerm_network_interface_security_group_association.vm
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/networkInterfaces/deliveroo-services-dev-vm716-f3acec4c|/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Network/networkSecurityGroups/deliveroo-services-dev-vm-nsg"
}

import {
  to = azurerm_linux_virtual_machine.vm
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Compute/virtualMachines/deliveroo-services-dev-vm"
}

import {
  to = azurerm_ssh_public_key.vm
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Compute/sshPublicKeys/deliveroo-services-dev-vm_key"
}

import {
  to = azurerm_dev_test_global_vm_shutdown_schedule.vm
  id = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.DevTestLab/schedules/shutdown-computevm-deliveroo-services-dev-vm"
}
