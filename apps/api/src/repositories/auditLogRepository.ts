import { getSupabaseAdminClient } from "../lib/supabase.js";
import { UserRole } from "../types.js";

export type AuditLogInput = {
  actorUserId?: string;
  actorRole?: UserRole;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

const memoryAuditLogs: AuditLogInput[] = [];

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    memoryAuditLogs.push(input);
    if (memoryAuditLogs.length > 500) {
      memoryAuditLogs.shift();
    }
    return;
  }

  const { error } = await supabase.from("audit_logs").insert({
    actor_user_id: input.actorUserId ?? null,
    actor_role: input.actorRole ?? null,
    action: input.action,
    entity: input.entity,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? {}
  });

  if (error) {
    throw new Error(`Failed to write audit log: ${error.message}`);
  }
}
