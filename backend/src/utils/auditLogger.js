import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async ({
    action,
    entityType,
    entityId = null,
    performedBy,
    description,
    metadata = {},
}) => {
    return AuditLog.create({
        action,
        entityType,
        entityId,
        performedBy,
        description,
        metadata,
    });
};