BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ticket] (
    [id] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL,
    [subject] NVARCHAR(1000) NOT NULL,
    [description] VARCHAR(max) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [deviationId] INT,
    CONSTRAINT [Ticket_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DescriptionVector] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ticketId] INT NOT NULL,
    [vectorValue] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DescriptionVector_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DescriptionVector_ticketId_id_key] UNIQUE NONCLUSTERED ([ticketId],[id])
);

-- CreateTable
CREATE TABLE [dbo].[Tag] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [ticketId] INT NOT NULL,
    CONSTRAINT [Tag_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Deviation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [creator] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL CONSTRAINT [Deviation_date_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Deviation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_deviationId_fkey] FOREIGN KEY ([deviationId]) REFERENCES [dbo].[Deviation]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DescriptionVector] ADD CONSTRAINT [DescriptionVector_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tag] ADD CONSTRAINT [Tag_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
