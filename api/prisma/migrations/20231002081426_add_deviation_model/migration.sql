BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ticket] ADD [deviationId] INT;

-- CreateTable
CREATE TABLE [dbo].[Deviation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [creator] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL CONSTRAINT [Deviation_date_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Deviation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_deviationId_fkey] FOREIGN KEY ([deviationId]) REFERENCES [dbo].[Deviation]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
